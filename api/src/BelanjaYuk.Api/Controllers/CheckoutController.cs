using BelanjaYuk.Api.Common;
using BelanjaYuk.Application.Features.Checkout.Dtos;
using BelanjaYuk.Application.Features.Checkout.Services;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BelanjaYuk.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/checkout")]
public class CheckoutController(ICheckoutService checkoutService) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<CheckoutResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Checkout(
        [FromBody] CheckoutRequest request,
        CancellationToken cancellationToken)
    {
        var result = await checkoutService.CheckoutAsync(request, cancellationToken);

        return StatusCode(
            StatusCodes.Status201Created,
            ApiResponse<CheckoutResponse>.Ok(result, "Pesanan berhasil dibuat."));
    }
}
