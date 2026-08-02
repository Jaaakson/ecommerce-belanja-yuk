using BelanjaYuk.Domain.Common;

namespace BelanjaYuk.Domain.Entities;

public class MsProduct : AuditableEntity
{
    public string IdProduct { get; set; } = null!;
    public string IdUserSeller { get; set; } = null!;
    public string ProductName { get; set; } = null!;
    public string? ProductDesc { get; set; }
    public string IdCategory { get; set; } = null!;
    public decimal Price { get; set; }

    /// <summary>
    /// Product discount expressed as a percentage (for example, 10 = 10%), not a fixed amount.
    /// If null, no discount is applied.
    /// Final price = Price * (1 - DiscountProduct / 100).
    /// </summary>
    public decimal? DiscountProduct { get; set; }

    public int Qty { get; set; }

    public LtCategory? Category { get; set; }
    public MsUserSeller? Seller { get; set; }
}
