using BelanjaYuk.Domain.Entities;
using BelanjaYuk.Infrastructure.Persistence.Extensions;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BelanjaYuk.Infrastructure.Persistence.Configurations;

public class TrBuyerTransactionConfiguration : IEntityTypeConfiguration<TrBuyerTransaction>
{
    public void Configure(EntityTypeBuilder<TrBuyerTransaction> builder)
    {
        builder.ToTable("TrBuyerTransaction");

        builder.HasKey(e => e.IdBuyerTransaction);

        builder.Property(e => e.IdBuyerTransaction).HasColumnType("nvarchar(36)").ValueGeneratedNever();
        builder.Property(e => e.IdUser).HasColumnType("nvarchar(36)").IsRequired();
        builder.Property(e => e.IdPayment).HasColumnType("nvarchar(36)").IsRequired();
        builder.Property(e => e.FinalPrice).HasColumnType("decimal(18,2)").IsRequired();
        builder.Property(e => e.Rating);
        builder.Property(e => e.RatingComment).HasColumnType("nvarchar(1000)");

        builder.HasIndex(e => e.IdUser);

        builder.HasOne<MsUser>()
            .WithMany()
            .HasForeignKey(e => e.IdUser)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Payment)
            .WithMany()
            .HasForeignKey(e => e.IdPayment)
            .OnDelete(DeleteBehavior.Restrict);

        builder.ConfigureAuditColumns();
        builder.HasQueryFilter(e => e.IsActive);
    }
}
