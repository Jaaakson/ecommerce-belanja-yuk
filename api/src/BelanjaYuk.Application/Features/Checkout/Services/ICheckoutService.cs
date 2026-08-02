using BelanjaYuk.Application.Features.Checkout.Dtos;

namespace BelanjaYuk.Application.Features.Checkout.Services;

public interface ICheckoutService
{
    Task<CheckoutResponse> CheckoutAsync(CheckoutRequest request, CancellationToken cancellationToken = default);
}
