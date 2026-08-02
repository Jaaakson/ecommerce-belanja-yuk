namespace BelanjaYuk.Application.Features.Checkout.Dtos;

public record CheckoutRequest(string IdPayment);

public record CheckoutResponse(
    string IdBuyerTransaction,
    string PaymentName,
    decimal Subtotal,
    decimal TotalDiscount,
    decimal ShippingCost,
    decimal FinalPrice,
    DateTime CreatedAt,
    IReadOnlyList<CheckoutLine> Items);

public record CheckoutLine(
    string ProductName,
    int Qty,
    decimal PriceProduct,
    decimal? DiscountPercentage,
    decimal Subtotal);
