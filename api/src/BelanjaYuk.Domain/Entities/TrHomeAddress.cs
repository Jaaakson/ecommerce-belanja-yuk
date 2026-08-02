using BelanjaYuk.Domain.Common;

namespace BelanjaYuk.Domain.Entities;

public class TrHomeAddress : AuditableEntity
{
    public string IdHomeAddress { get; set; } = null!;
    public string IdUser { get; set; } = null!;
    public string Provinsi { get; set; } = null!;

    /// <summary>
    /// Maps the "Kota/Kabupaten" column in the ERD. The slash is dropped
    /// because it isn't a valid C# identifier character.
    /// </summary>
    public string KotaKabupaten { get; set; } = null!;

    public string Kecamatan { get; set; } = null!;
    public string KodePos { get; set; } = null!;
    public string HomeAddressDesc { get; set; } = null!;

    /// <summary>
    /// Marks the default shipping address. The "one primary per user" rule is
    /// enforced in the service layer, not by a database constraint.
    /// </summary>
    public bool IsPrimaryAddress { get; set; }

    public MsUser? User { get; set; }
}
