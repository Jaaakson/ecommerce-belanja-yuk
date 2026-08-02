namespace BelanjaYuk.Application.Features.Auth.Dtos;

public record RegisterRequest(
    string FullName,
    string UserName,
    string Email,
    string PhoneNumber,
    string Password,
    string ConfirmPassword,
    DateTime? DateOfBirth,
    string IdGender,
    AddressRequest? PrimaryAddress);

public record AddressRequest(
    string Provinsi,
    string KotaKabupaten,
    string Kecamatan,
    string KodePos,
    string HomeAddressDesc);
