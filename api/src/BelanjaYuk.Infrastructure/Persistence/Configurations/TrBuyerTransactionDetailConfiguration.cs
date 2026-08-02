using BelanjaYuk.Domain.Entities;
using BelanjaYuk.Infrastructure.Persistence.Extensions;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BelanjaYuk.Infrastructure.Persistence.Configurations;

public class TrBuyerTransactionDetailConfiguration : IEntityTypeConfiguration<TrBuyerTransactionDetail>
{
    public void Configure(EntityTypeBuilder<TrBuyerTransactionDetail> builder)
    {
        builder.ToTable("TrBuyerTransactionDetail");

        builder.HasKey(e => e.IdBuyerTransactionDetail);

        builder.Property(e => e.IdBuyerTransactionDetail).HasColumnType("nvarchar(36)").ValueGeneratedNever();
        builder.Property(e => e.IdBuyerTransaction).HasColumnType("nvarchar(36)").IsRequired();
        builder.Property(e => e.IdProduct).HasColumnType("nvarchar(36)").IsRequired();
        builder.Property(e => e.Qty).IsRequired();
        builder.Property(e => e.PriceProduct).HasColumnType("decimal(18,2)").IsRequired();
        builder.Property(e => e.DiscountProduct).HasColumnType("decimal(18,0)");
        builder.Property(e => e.Rating);
        builder.Property(e => e.RatingComment).HasColumnType("nvarchar(1000)");

        builder.HasIndex(e => e.IdBuyerTransaction);

        builder.HasOne(e => e.Transaction)
            .WithMany(t => t.Details)
            .HasForeignKey(e => e.IdBuyerTransaction)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Product)
            .WithMany()
            .HasForeignKey(e => e.IdProduct)
            .OnDelete(DeleteBehavior.Restrict);

        builder.ConfigureAuditColumns();
        builder.HasQueryFilter(e => e.IsActive);
    }
}
