namespace BelanjaYuk.Application.Features.Products.Dtos;

/// <summary>
/// Shape used by the product grid. Discount values are resolved server-side so
/// the client never recomputes prices, and only one thumbnail is included to
/// keep list payloads small.
/// </summary>
public record ProductListItem(
    string IdProduct,
    string ProductName,
    string CategoryName,
    decimal Price,
    decimal? DiscountPercentage,
    decimal FinalPrice,
    int Qty,
    string? ThumbnailUrl);

public record ProductDetail(
    string IdProduct,
    string ProductName,
    string? ProductDesc,
    string IdCategory,
    string CategoryName,
    string SellerName,
    decimal Price,
    decimal? DiscountPercentage,
    decimal FinalPrice,
    int Qty,
    IReadOnlyList<string> Images);
