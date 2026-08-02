using BelanjaYuk.Domain.Common;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BelanjaYuk.Infrastructure.Persistence.Extensions;

public static class AuditableEntityBuilderExtensions
{
    /// <summary>
    /// Maps the audit columns shared by every table in the BelanjaYuk ERD.
    /// </summary>
    public static EntityTypeBuilder<TEntity> ConfigureAuditColumns<TEntity>(
        this EntityTypeBuilder<TEntity> builder)
        where TEntity : AuditableEntity
    {
        builder.Property(e => e.DateIn).HasColumnType("datetime2").IsRequired();
        builder.Property(e => e.UserIn).HasColumnType("nvarchar(36)").IsRequired();
        builder.Property(e => e.DateUp).HasColumnType("datetime2");
        builder.Property(e => e.UserUp).HasColumnType("nvarchar(36)");
        builder.Property(e => e.IsActive).IsRequired();

        return builder;
    }
}
