using BelanjaYuk.Domain.Common;

namespace BelanjaYuk.Domain.Entities;

public class MsUserSeller : AuditableEntity
{
    public string IdUserSeller { get; set; } = null!;
    public string IdUser { get; set; } = null!;
    public string SellerName { get; set; } = null!;
    public string? SellerDesc { get; set; }
    public string? Address { get; set; }
    public string? SellerCode { get; set; }
    public string? PhoneNumber { get; set; }
}
