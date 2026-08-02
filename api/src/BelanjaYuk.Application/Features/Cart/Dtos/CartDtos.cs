namespace BelanjaYuk.Application.Features.Cart.Dtos;

public record CartItem(
    string IdBuyerCart,
    string IdProduct,
    string ProductName,
    string? ThumbnailUrl,
    decimal Price,
    decimal? DiscountPercentage,
    decimal FinalPrice,
    decimal DiscountAmount,
    int Qty,
    int AvailableStock,
    decimal Subtotal);

/// <summary>
/// Every monetary field is computed server-side. The client submits product
/// identifiers and quantities only, never prices.
/// </summary>
public record CartSummary(
    IReadOnlyList<CartItem> Items,
    decimal Subtotal,
    decimal TotalDiscount,
    decimal ShippingCost,
    decimal Total);

public record AddToCartRequest(string IdProduct, int Qty);

public record UpdateCartItemRequest(int Qty);
