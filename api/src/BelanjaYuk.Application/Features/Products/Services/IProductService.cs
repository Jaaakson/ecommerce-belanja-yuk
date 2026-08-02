using BelanjaYuk.Application.Common.Models;
using BelanjaYuk.Application.Features.Products.Dtos;

namespace BelanjaYuk.Application.Features.Products.Services;

public interface IProductService
{
    Task<PagedResult<ProductListItem>> GetAsync(ProductQuery query, CancellationToken cancellationToken = default);

    Task<ProductDetail> GetByIdAsync(string idProduct, CancellationToken cancellationToken = default);
}
