using BelanjaYuk.Domain.Entities;
using BelanjaYuk.Infrastructure.Persistence.Extensions;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BelanjaYuk.Infrastructure.Persistence.Configurations;

public class TrBuyerCartConfiguration : IEntityTypeConfiguration<TrBuyerCart>
{
    public void Configure(EntityTypeBuilder<TrBuyerCart> builder)
    {
        builder.ToTable("TrBuyerCart");

        builder.HasKey(e => e.IdBuyerCart);

        builder.Property(e => e.IdBuyerCart).HasColumnType("nvarchar(36)").ValueGeneratedNever();
        builder.Property(e => e.IdUser).HasColumnType("nvarchar(36)").IsRequired();
        builder.Property(e => e.IdProduct).HasColumnType("nvarchar(36)").IsRequired();
        builder.Property(e => e.Qty).IsRequired();

        builder.HasIndex(e => new { e.IdUser, e.IdProduct });

        builder.HasOne<MsUser>()
            .WithMany()
            .HasForeignKey(e => e.IdUser)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Product)
            .WithMany()
            .HasForeignKey(e => e.IdProduct)
            .OnDelete(DeleteBehavior.Restrict);

        builder.ConfigureAuditColumns();
        builder.HasQueryFilter(e => e.IsActive);
    }
}
