using BelanjaYuk.Domain.Entities;
using BelanjaYuk.Infrastructure.Persistence.Extensions;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BelanjaYuk.Infrastructure.Persistence.Configurations;

public class MsUserSellerConfiguration : IEntityTypeConfiguration<MsUserSeller>
{
    public void Configure(EntityTypeBuilder<MsUserSeller> builder)
    {
        builder.ToTable("MsUserSeller");

        builder.HasKey(e => e.IdUserSeller);

        builder.Property(e => e.IdUserSeller).HasColumnType("nvarchar(36)").ValueGeneratedNever();
        builder.Property(e => e.IdUser).HasColumnType("nvarchar(36)").IsRequired();
        builder.Property(e => e.SellerName).HasColumnType("nvarchar(100)").IsRequired();
        builder.Property(e => e.SellerDesc).HasColumnType("nvarchar(1000)");
        builder.Property(e => e.Address).HasColumnType("nvarchar(500)");
        builder.Property(e => e.SellerCode).HasColumnType("nvarchar(100)");
        builder.Property(e => e.PhoneNumber).HasColumnType("nvarchar(50)");

        builder.HasIndex(e => e.SellerCode)
            .IsUnique()
            .HasFilter("[SellerCode] IS NOT NULL");

        builder.HasOne<MsUser>()
            .WithMany()
            .HasForeignKey(e => e.IdUser)
            .OnDelete(DeleteBehavior.Restrict);

        builder.ConfigureAuditColumns();
        builder.HasQueryFilter(e => e.IsActive);
    }
}
