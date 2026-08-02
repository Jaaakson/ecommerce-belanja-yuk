using BelanjaYuk.Domain.Common;

namespace BelanjaYuk.Domain.Entities;

public class MsUser : AuditableEntity
{
    public string IdUser { get; set; } = null!;
    public string UserName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string? LastName { get; set; }
    public DateTime? DOB { get; set; }
    public string IdGender { get; set; } = null!;

    public LtGender? Gender { get; set; }
    public MsUserPassword? Password { get; set; }
}
