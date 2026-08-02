using System.Security.Claims;

using BelanjaYuk.Application.Common.Interfaces;

namespace BelanjaYuk.Api.Services;

public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    public string? UserId =>
        httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
}
