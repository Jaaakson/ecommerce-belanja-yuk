using BelanjaYuk.Domain.Entities;
using BelanjaYuk.Infrastructure.Persistence.Extensions;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BelanjaYuk.Infrastructure.Persistence.Configurations;

public class LtCategoryConfiguration : IEntityTypeConfiguration<LtCategory>
{
    public void Configure(EntityTypeBuilder<LtCategory> builder)
    {
        builder.ToTable("LtCategory");

        builder.HasKey(e => e.IdCategory);

        builder.Property(e => e.IdCategory).HasColumnType("nvarchar(36)").ValueGeneratedNever();
        builder.Property(e => e.CategoryName).HasColumnType("nvarchar(100)").IsRequired();

        builder.ConfigureAuditColumns();
    }
}
