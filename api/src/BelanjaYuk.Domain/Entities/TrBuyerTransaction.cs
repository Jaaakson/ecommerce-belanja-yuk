using BelanjaYuk.Domain.Common;

namespace BelanjaYuk.Domain.Entities;

public class TrBuyerTransaction : AuditableEntity
{
    public string IdBuyerTransaction { get; set; } = null!;
    public string IdUser { get; set; } = null!;
    public string IdPayment { get; set; } = null!;

    /// <summary>
    /// Total actually charged: discounted subtotal plus shipping.
    /// Stored rather than recomputed so historical orders stay stable when
    /// product prices change.
    /// </summary>
    public decimal FinalPrice { get; set; }

    /// <summary>
    /// Rates the order as a whole. Nullable because ratings arrive after
    /// delivery, while this row is created at checkout.
    /// </summary>
    public int? Rating { get; set; }

    public string? RatingComment { get; set; }

    public MsUser? User { get; set; }
    public LtPayment? Payment { get; set; }
    public ICollection<TrBuyerTransactionDetail> Details { get; set; } = new List<TrBuyerTransactionDetail>();
}
