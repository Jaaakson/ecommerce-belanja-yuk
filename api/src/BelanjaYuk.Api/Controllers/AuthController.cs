using BelanjaYuk.Api.Common;
using BelanjaYuk.Application.Common.Interfaces;
using BelanjaYuk.Application.Features.Auth.Dtos;
using BelanjaYuk.Application.Features.Auth.Services;


using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace BelanjaYuk.Api.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class AuthController(
    IAuthService authService,
    ICurrentUserService currentUserService) : ControllerBase
{
    [HttpPost("register")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Register(
        [FromBody] RegisterRequest request,
        CancellationToken cancellationToken)
    {
        var result = await authService.RegisterAsync(request, cancellationToken);

        return StatusCode(
            StatusCodes.Status201Created,
            ApiResponse<AuthResponse>.Ok(result, "Akun berhasil dibuat."));
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequest request,
        CancellationToken cancellationToken)
    {
        var result = await authService.LoginAsync(request, cancellationToken);

        return Ok(ApiResponse<AuthResponse>.Ok(result, "Login berhasil."));
    }

    /// <summary>
    /// Smoke test for the JWT pipeline: proves the token validates and that
    /// CurrentUserService reads the identifier claim the interceptor depends on.
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult Me() =>
        Ok(ApiResponse<string>.Ok(currentUserService.UserId!, "Token valid."));
}
