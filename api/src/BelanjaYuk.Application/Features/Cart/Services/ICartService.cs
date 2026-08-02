using BelanjaYuk.Application.Features.Cart.Dtos;

namespace BelanjaYuk.Application.Features.Cart.Services;

public interface ICartService
{
    Task<CartSummary> GetAsync(CancellationToken cancellationToken = default);

    Task<CartSummary> AddAsync(AddToCartRequest request, CancellationToken cancellationToken = default);

    Task<CartSummary> UpdateQuantityAsync(string idBuyerCart, int qty, CancellationToken cancellationToken = default);

    Task<CartSummary> RemoveAsync(string idBuyerCart, CancellationToken cancellationToken = default);
}
