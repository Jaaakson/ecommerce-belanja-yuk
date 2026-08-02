using BelanjaYuk.Domain.Common;

namespace BelanjaYuk.Domain.Entities;

public class LtCategory : AuditableEntity
{
    public string IdCategory { get; set; } = null!;
    public string CategoryName { get; set; } = null!;
}
