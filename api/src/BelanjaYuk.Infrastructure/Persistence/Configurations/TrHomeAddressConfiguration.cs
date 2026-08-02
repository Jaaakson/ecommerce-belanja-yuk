using BelanjaYuk.Domain.Entities;
using BelanjaYuk.Infrastructure.Persistence.Extensions;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BelanjaYuk.Infrastructure.Persistence.Configurations;

public class TrHomeAddressConfiguration : IEntityTypeConfiguration<TrHomeAddress>
{
    public void Configure(EntityTypeBuilder<TrHomeAddress> builder)
    {
        builder.ToTable("TrHomeAddress");

        builder.HasKey(e => e.IdHomeAddress);

        builder.Property(e => e.IdHomeAddress).HasColumnName("IdhomeAddress").HasColumnType("nvarchar(36)").ValueGeneratedNever();
        builder.Property(e => e.IdUser).HasColumnType("nvarchar(36)").IsRequired();
        builder.Property(e => e.Provinsi).HasColumnType("nvarchar(100)").IsRequired();
        builder.Property(e => e.KotaKabupaten).HasColumnName("KotaKabupaten").HasColumnType("nvarchar(100)").IsRequired();
        builder.Property(e => e.Kecamatan).HasColumnType("nvarchar(100)").IsRequired();
        builder.Property(e => e.KodePos).HasColumnType("nvarchar(10)").IsRequired();
        builder.Property(e => e.HomeAddressDesc).HasColumnType("nvarchar(2000)").IsRequired();
        builder.Property(e => e.IsPrimaryAddress).IsRequired();

        builder.HasIndex(e => e.IdUser);

        builder.HasOne<MsUser>()
            .WithMany()
            .HasForeignKey(e => e.IdUser)
            .OnDelete(DeleteBehavior.Restrict);

        builder.ConfigureAuditColumns();
        builder.HasQueryFilter(e => e.IsActive);
    }
}
