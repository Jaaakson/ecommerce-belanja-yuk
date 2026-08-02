using BelanjaYuk.Domain.Common;

namespace BelanjaYuk.Domain.Entities;

public class TrBuyerTransactionDetail : AuditableEntity
{
    public string IdBuyerTransactionDetail { get; set; } = null!;
    public string IdBuyerTransaction { get; set; } = null!;
    public string IdProduct { get; set; } = null!;
    public int Qty { get; set; }

    /// <summary>
    /// Copied from MsProduct at checkout rather than joined at read time.
    /// Prices change; snapshotting keeps past invoices consistent with what
    /// the buyer actually paid.
    /// </summary>
    public decimal PriceProduct { get; set; }

    /// <summary>
    /// Percentage discount captured alongside PriceProduct, for the same reason.
    /// </summary>
    public decimal? DiscountProduct { get; set; }

    public int? Rating { get; set; }
    public string? RatingComment { get; set; }

    public TrBuyerTransaction? Transaction { get; set; }
    public MsProduct? Product { get; set; }
}
