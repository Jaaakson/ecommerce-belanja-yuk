namespace BelanjaYuk.Application.Features.Auth.Dtos;

public record AuthResponse(
    string Token,
    DateTime ExpiresAt,
    UserSummary User);

public record UserSummary(
    string IdUser,
    string UserName,
    string Email,
    string FullName);
