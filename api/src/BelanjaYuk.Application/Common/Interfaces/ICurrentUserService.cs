namespace BelanjaYuk.Application.Common.Interfaces;

/// <summary>
/// Exposes the authenticated user's identity to layers that must not depend
/// on ASP.NET Core. Returns null when the request is anonymous.
/// </summary>
public interface ICurrentUserService
{
    string? UserId { get; }
}
