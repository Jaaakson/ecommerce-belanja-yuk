using BelanjaYuk.Api.Common;
using BelanjaYuk.Application.Features.Lookups.Dtos;
using BelanjaYuk.Application.Features.Lookups.Services;

using Microsoft.AspNetCore.Mvc;

namespace BelanjaYuk.Api.Controllers;

[ApiController]
[Route("api/v1")]
public class LookupsController(ILookupService lookupService) : ControllerBase
{
    [HttpGet("categories")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<LookupItem>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCategories(CancellationToken cancellationToken) =>
        Ok(ApiResponse<IReadOnlyList<LookupItem>>.Ok(
            await lookupService.GetCategoriesAsync(cancellationToken)));

    [HttpGet("genders")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<LookupItem>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetGenders(CancellationToken cancellationToken) =>
        Ok(ApiResponse<IReadOnlyList<LookupItem>>.Ok(
            await lookupService.GetGendersAsync(cancellationToken)));

    [HttpGet("payments")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<LookupItem>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPayments(CancellationToken cancellationToken) =>
        Ok(ApiResponse<IReadOnlyList<LookupItem>>.Ok(
            await lookupService.GetPaymentsAsync(cancellationToken)));
}
