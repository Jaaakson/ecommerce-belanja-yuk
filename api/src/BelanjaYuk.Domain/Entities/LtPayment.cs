using BelanjaYuk.Domain.Common;

namespace BelanjaYuk.Domain.Entities;

public class LtPayment : AuditableEntity
{
    public string IdPayment { get; set; } = null!;
    public string PaymentName { get; set; } = null!;
}
