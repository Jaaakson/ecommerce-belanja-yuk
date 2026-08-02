using BelanjaYuk.Domain.Common;

namespace BelanjaYuk.Domain.Entities;

public class TrProductImages : AuditableEntity
{
    public string IdProductImages { get; set; } = null!;
    public string IdProduct { get; set; } = null!;

    /// <summary>
    /// Stores an image URL, not base64 content. NVARCHAR(MAX) allows either,
    /// but base64 inflates response payloads and defeats browser caching.
    /// </summary>
    public string ProductImage { get; set; } = null!;

    public MsProduct? Product { get; set; }
}
