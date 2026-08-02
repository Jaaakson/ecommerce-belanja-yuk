using BelanjaYuk.Application.Common.Exceptions;
using BelanjaYuk.Application.Common.Interfaces;
using BelanjaYuk.Application.Features.Auth.Dtos;
using BelanjaYuk.Domain.Entities;

using Microsoft.EntityFrameworkCore;

namespace BelanjaYuk.Application.Features.Auth.Services;

public class AuthService(
    IAppDbContext context,
    IPasswordHasher passwordHasher,
    IJwtTokenGenerator tokenGenerator) : IAuthService
{
    public async Task<AuthResponse> RegisterAsync(
        RegisterRequest request,
        CancellationToken cancellationToken = default)
    {
        await EnsureIdentityIsAvailableAsync(request, cancellationToken);

        var genderExists = await context.LtGenders
            .AnyAsync(g => g.IdGender == request.IdGender && g.IsActive, cancellationToken);

        if (!genderExists)
        {
            throw new ValidationException(new Dictionary<string, string[]>
            {
                [nameof(request.IdGender)] = ["Jenis kelamin tidak valid."]
            });
        }

        var (firstName, lastName) = SplitFullName(request.FullName);

        var user = new MsUser
        {
            IdUser = NewId(),
            UserName = request.UserName,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            FirstName = firstName,
            LastName = lastName,
            DOB = request.DateOfBirth,
            IdGender = request.IdGender
        };

        var password = new MsUserPassword
        {
            IdUserPassword = NewId(),
            IdUser = user.IdUser,
            PasswordHash = passwordHasher.Hash(request.Password)
        };

        context.MsUsers.Add(user);
        context.MsUserPasswords.Add(password);

        if (request.PrimaryAddress is { } address)
        {
            context.TrHomeAddresses.Add(new TrHomeAddress
            {
                IdHomeAddress = NewId(),
                IdUser = user.IdUser,
                Provinsi = address.Provinsi,
                KotaKabupaten = address.KotaKabupaten,
                Kecamatan = address.Kecamatan,
                KodePos = address.KodePos,
                HomeAddressDesc = address.HomeAddressDesc,
                IsPrimaryAddress = true
            });
        }

        await context.SaveChangesAsync(cancellationToken);

        return BuildAuthResponse(user);
    }

    public async Task<AuthResponse> LoginAsync(
        LoginRequest request,
        CancellationToken cancellationToken = default)
    {
        var identifier = request.Identifier.Trim();

        var user = await context.MsUsers
            .FirstOrDefaultAsync(
                u => u.Email == identifier || u.PhoneNumber == identifier,
                cancellationToken);

        if (user is null)
        {
            throw new UnauthorizedException("Email atau nomor HP tidak terdaftar.");
        }

        var storedPassword = await context.MsUserPasswords
            .Where(p => p.IdUser == user.IdUser)
            .OrderByDescending(p => p.DateIn)
            .FirstOrDefaultAsync(cancellationToken);

        if (storedPassword is null || !passwordHasher.Verify(request.Password, storedPassword.PasswordHash))
        {
            throw new UnauthorizedException("Kata sandi salah.");
        }

        return BuildAuthResponse(user);
    }

    /// <summary>
    /// Checks uniqueness in a single round trip. The database still enforces
    /// these constraints through unique indexes; this only produces a friendlier
    /// error than a raw constraint violation.
    /// </summary>
    private async Task EnsureIdentityIsAvailableAsync(
        RegisterRequest request,
        CancellationToken cancellationToken)
    {
        var conflicts = await context.MsUsers
            .Where(u => u.UserName == request.UserName
                        || u.Email == request.Email
                        || u.PhoneNumber == request.PhoneNumber)
            .Select(u => new { u.UserName, u.Email, u.PhoneNumber })
            .ToListAsync(cancellationToken);

        if (conflicts.Count == 0)
        {
            return;
        }

        var errors = new Dictionary<string, string[]>();

        if (conflicts.Any(u => u.UserName == request.UserName))
        {
            errors[nameof(request.UserName)] = ["Username sudah digunakan."];
        }

        if (conflicts.Any(u => u.Email == request.Email))
        {
            errors[nameof(request.Email)] = ["Email sudah terdaftar."];
        }

        if (conflicts.Any(u => u.PhoneNumber == request.PhoneNumber))
        {
            errors[nameof(request.PhoneNumber)] = ["Nomor HP sudah terdaftar."];
        }

        throw new ConflictException(string.Join(" ", errors.SelectMany(e => e.Value)));
    }

    /// <summary>
    /// The registration form captures a single full name while the ERD stores
    /// Firstname and LastName separately. The first token becomes the first
    /// name; anything after it becomes the last name.
    /// </summary>
    private static (string FirstName, string? LastName) SplitFullName(string fullName)
    {
        var trimmed = fullName.Trim();
        var separatorIndex = trimmed.IndexOf(' ');

        return separatorIndex < 0
            ? (trimmed, null)
            : (trimmed[..separatorIndex], trimmed[(separatorIndex + 1)..].Trim());
    }

    private AuthResponse BuildAuthResponse(MsUser user)
    {
        var (token, expiresAt) = tokenGenerator.Generate(user);

        var fullName = string.IsNullOrWhiteSpace(user.LastName)
            ? user.FirstName
            : $"{user.FirstName} {user.LastName}";

        return new AuthResponse(
            token,
            expiresAt,
            new UserSummary(user.IdUser, user.UserName, user.Email, fullName));
    }

    private static string NewId() => Guid.NewGuid().ToString();
}
