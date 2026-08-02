using BelanjaYuk.Domain.Common;

namespace BelanjaYuk.Domain.Entities;

public class TrBuyerCart : AuditableEntity
{
    public string IdBuyerCart { get; set; } = null!;
    public string IdUser { get; set; } = null!;
    public string IdProduct { get; set; } = null!;
    public int Qty { get; set; }

    public MsProduct? Product { get; set; }
}
