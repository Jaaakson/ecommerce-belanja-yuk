using BelanjaYuk.Api.Common;
using BelanjaYuk.Application.Features.Cart.Dtos;
using BelanjaYuk.Application.Features.Cart.Services;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BelanjaYuk.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/cart")]
public class CartController(ICartService cartService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<CartSummary>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Get(CancellationToken cancellationToken) =>
        Ok(ApiResponse<CartSummary>.Ok(await cartService.GetAsync(cancellationToken)));

    [HttpPost("items")]
    [ProducesResponseType(typeof(ApiResponse<CartSummary>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Add(
        [FromBody] AddToCartRequest request,
        CancellationToken cancellationToken) =>
        Ok(ApiResponse<CartSummary>.Ok(
            await cartService.AddAsync(request, cancellationToken),
            "Barang ditambahkan ke keranjang."));

    [HttpPatch("items/{idBuyerCart}")]
    [ProducesResponseType(typeof(ApiResponse<CartSummary>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateQuantity(
        string idBuyerCart,
        [FromBody] UpdateCartItemRequest request,
        CancellationToken cancellationToken) =>
        Ok(ApiResponse<CartSummary>.Ok(
            await cartService.UpdateQuantityAsync(idBuyerCart, request.Qty, cancellationToken)));

    [HttpDelete("items/{idBuyerCart}")]
    [ProducesResponseType(typeof(ApiResponse<CartSummary>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Remove(
        string idBuyerCart,
        CancellationToken cancellationToken) =>
        Ok(ApiResponse<CartSummary>.Ok(
            await cartService.RemoveAsync(idBuyerCart, cancellationToken),
            "Barang dihapus dari keranjang."));
}
