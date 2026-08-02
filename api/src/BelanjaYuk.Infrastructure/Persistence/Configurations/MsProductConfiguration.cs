using BelanjaYuk.Domain.Entities;
using BelanjaYuk.Infrastructure.Persistence.Extensions;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BelanjaYuk.Infrastructure.Persistence.Configurations;

public class MsProductConfiguration : IEntityTypeConfiguration<MsProduct>
{
    public void Configure(EntityTypeBuilder<MsProduct> builder)
    {
        builder.ToTable("MsProduct");

        builder.HasKey(e => e.IdProduct);

        builder.Property(e => e.IdProduct).HasColumnType("nvarchar(36)").ValueGeneratedNever();
        builder.Property(e => e.IdUserSeller).HasColumnType("nvarchar(36)").IsRequired();
        builder.Property(e => e.ProductName).HasColumnType("nvarchar(200)").IsRequired();
        builder.Property(e => e.ProductDesc).HasColumnType("nvarchar(2000)");
        builder.Property(e => e.IdCategory).HasColumnType("nvarchar(36)").IsRequired();
        builder.Property(e => e.Price).HasColumnType("decimal(18,2)").IsRequired();
        builder.Property(e => e.DiscountProduct).HasColumnType("decimal(18,0)");
        builder.Property(e => e.Qty).IsRequired();

        builder.HasIndex(e => e.IdCategory);

        builder.HasOne(e => e.Category)
            .WithMany()
            .HasForeignKey(e => e.IdCategory)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Seller)
            .WithMany()
            .HasForeignKey(e => e.IdUserSeller)
            .OnDelete(DeleteBehavior.Restrict);

        builder.ConfigureAuditColumns();
        builder.HasQueryFilter(e => e.IsActive);
    }
}
