namespace BelanjaYuk.Domain.Common;

/// <summary>
/// Common audit fields shared across all tables in the BelanjaYuk ERD.
/// These values are populated automatically by the SaveChanges interceptor,
/// so individual services don't need to handle them.
/// </summary>
public abstract class AuditableEntity
{
    public DateTime DateIn { get; set; }
    public string UserIn { get; set; } = null!;
    public DateTime? DateUp { get; set; }
    public string? UserUp { get; set; }
    public bool IsActive { get; set; } = true;
}
