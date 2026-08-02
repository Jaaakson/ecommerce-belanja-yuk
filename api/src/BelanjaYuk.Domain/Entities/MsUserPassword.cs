using BelanjaYuk.Domain.Common;

namespace BelanjaYuk.Domain.Entities;

public class MsUserPassword : AuditableEntity
{
    public string IdUserPassword { get; set; } = null!;
    public string IdUser { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;

    public MsUser User { get; set; } = null!;
}
