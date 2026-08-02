using BelanjaYuk.Domain.Entities;
using BelanjaYuk.Infrastructure.Persistence.Extensions;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BelanjaYuk.Infrastructure.Persistence.Configurations;

public class TrProductImagesConfiguration : IEntityTypeConfiguration<TrProductImages>
{
    public void Configure(EntityTypeBuilder<TrProductImages> builder)
    {
        builder.ToTable("TrProductImages");

        builder.HasKey(e => e.IdProductImages);

        builder.Property(e => e.IdProductImages).HasColumnType("nvarchar(36)").ValueGeneratedNever();
        builder.Property(e => e.IdProduct).HasColumnType("nvarchar(36)").IsRequired();
        builder.Property(e => e.ProductImage).HasColumnType("nvarchar(max)").IsRequired();

        builder.HasIndex(e => e.IdProduct);

        builder.HasOne(e => e.Product)
            .WithMany(p => p.Images)
            .HasForeignKey(e => e.IdProduct)
            .OnDelete(DeleteBehavior.Restrict);

        builder.ConfigureAuditColumns();
        builder.HasQueryFilter(e => e.IsActive);
    }
}
