namespace BelanjaYuk.Application.Features.Auth.Dtos;

/// <summary>
/// <paramref name="Identifier"/> accepts either an email address or a phone
/// number, matching the login form in the BelanjaYuk specification.
/// </summary>
public record LoginRequest(string Identifier, string Password);
