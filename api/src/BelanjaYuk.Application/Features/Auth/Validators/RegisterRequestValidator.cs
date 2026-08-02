using System.Text.RegularExpressions;

using BelanjaYuk.Application.Features.Auth.Dtos;

using FluentValidation;

namespace BelanjaYuk.Application.Features.Auth.Validators;

public partial class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Nama lengkap wajib diisi.");

        RuleFor(x => x.UserName)
            .NotEmpty().WithMessage("Username wajib diisi.")
            .Length(5, 30).WithMessage("Username harus 5-30 karakter.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email wajib diisi.")
            .EmailAddress().WithMessage("Format email tidak valid.");

        RuleFor(x => x.PhoneNumber)
            .NotEmpty().WithMessage("Nomor HP wajib diisi.")
            .Must(BeAnIndonesianPhoneNumber).WithMessage("Nomor HP tidak valid.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Kata sandi wajib diisi.")
            .MinimumLength(8).WithMessage("Kata sandi minimal 8 karakter.");

        RuleFor(x => x.ConfirmPassword)
            .Equal(x => x.Password).WithMessage("Kata sandi tidak sama.");

        RuleFor(x => x.IdGender)
            .NotEmpty().WithMessage("Jenis kelamin wajib dipilih.");

        RuleFor(x => x.DateOfBirth)
            .LessThan(DateTime.UtcNow).WithMessage("Tanggal lahir tidak valid.")
            .When(x => x.DateOfBirth.HasValue);

        // The spec marks the primary address as optional, but validates its
        // contents once the user chooses to fill it in.
        When(x => x.PrimaryAddress is not null, () =>
        {
            RuleFor(x => x.PrimaryAddress!.HomeAddressDesc)
                .NotEmpty().WithMessage("Alamat lengkap wajib diisi.")
                .MinimumLength(10).WithMessage("Alamat minimal 10 karakter.");

            RuleFor(x => x.PrimaryAddress!.Provinsi)
                .NotEmpty().WithMessage("Provinsi wajib diisi.");

            RuleFor(x => x.PrimaryAddress!.KotaKabupaten)
                .NotEmpty().WithMessage("Kota/Kabupaten wajib diisi.");

            RuleFor(x => x.PrimaryAddress!.Kecamatan)
                .NotEmpty().WithMessage("Kecamatan wajib diisi.");

            RuleFor(x => x.PrimaryAddress!.KodePos)
                .NotEmpty().WithMessage("Kode pos wajib diisi.")
                .Matches(@"^\d{5}$").WithMessage("Kode pos harus 5 digit.");
        });
    }

    private static bool BeAnIndonesianPhoneNumber(string phoneNumber) =>
        IndonesianPhoneRegex().IsMatch(phoneNumber);

    // Accepts 08xxx, 628xxx, and +628xxx.
    [GeneratedRegex(@"^(\+62|62|0)8[1-9][0-9]{6,11}$")]
    private static partial Regex IndonesianPhoneRegex();
}
