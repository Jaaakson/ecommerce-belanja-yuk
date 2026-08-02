using BelanjaYuk.Api.Common;
using BelanjaYuk.Application.Common.Models;
using BelanjaYuk.Application.Features.Products.Dtos;
using BelanjaYuk.Application.Features.Products.Services;

using Microsoft.AspNetCore.Mvc;

namespace BelanjaYuk.Api.Controllers;

[ApiController]
[Route("api/v1/products")]
public class ProductsController(IProductService productService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<ProductListItem>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Get(
        [FromQuery] ProductQuery query,
        CancellationToken cancellationToken)
    {
        var result = await productService.GetAsync(query, cancellationToken);

        return Ok(ApiResponse<PagedResult<ProductListItem>>.Ok(result));
    }

    [HttpGet("{idProduct}")]
    [ProducesResponseType(typeof(ApiResponse<ProductDetail>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(
        string idProduct,
        CancellationToken cancellationToken)
    {
        var result = await productService.GetByIdAsync(idProduct, cancellationToken);

        return Ok(ApiResponse<ProductDetail>.Ok(result));
    }
}
