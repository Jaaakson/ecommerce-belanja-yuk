using BelanjaYuk.Domain.Common;

namespace BelanjaYuk.Domain.Entities;

public class LtGender : AuditableEntity
{
    public string IdGender { get; set; } = null!;
    public string GenderName { get; set; } = null!;
}
