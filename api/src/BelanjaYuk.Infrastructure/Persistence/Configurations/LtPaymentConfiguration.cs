using BelanjaYuk.Domain.Entities;
using BelanjaYuk.Infrastructure.Persistence.Extensions;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BelanjaYuk.Infrastructure.Persistence.Configurations;

public class LtPaymentConfiguration : IEntityTypeConfiguration<LtPayment>
{
    public void Configure(EntityTypeBuilder<LtPayment> builder)
    {
        builder.ToTable("LtPayment");

        builder.HasKey(e => e.IdPayment);

        builder.Property(e => e.IdPayment).HasColumnType("nvarchar(36)").ValueGeneratedNever();
        builder.Property(e => e.PaymentName).HasColumnType("nvarchar(100)").IsRequired();

        builder.ConfigureAuditColumns();
    }
}
