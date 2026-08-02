using BelanjaYuk.Domain.Entities;
using BelanjaYuk.Infrastructure.Persistence.Extensions;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BelanjaYuk.Infrastructure.Persistence.Configurations;

public class MsUserConfiguration : IEntityTypeConfiguration<MsUser>
{
    public void Configure(EntityTypeBuilder<MsUser> builder)
    {
        builder.ToTable("MsUser");

        builder.HasKey(e => e.IdUser);

        builder.Property(e => e.IdUser).HasColumnType("nvarchar(36)").ValueGeneratedNever();
        builder.Property(e => e.UserName).HasColumnType("nvarchar(100)").IsRequired();
        builder.Property(e => e.Email).HasColumnType("nvarchar(100)").IsRequired();
        builder.Property(e => e.PhoneNumber).HasColumnType("nvarchar(50)").IsRequired();
        builder.Property(e => e.FirstName).HasColumnName("Firstname").HasColumnType("nvarchar(100)").IsRequired();
        builder.Property(e => e.LastName).HasColumnType("nvarchar(200)");
        builder.Property(e => e.DOB).HasColumnType("datetime2");
        builder.Property(e => e.IdGender).HasColumnType("nvarchar(36)").IsRequired();

        builder.HasIndex(e => e.UserName).IsUnique();
        builder.HasIndex(e => e.Email).IsUnique();
        builder.HasIndex(e => e.PhoneNumber).IsUnique();

        builder.HasOne(e => e.Gender)
            .WithMany()
            .HasForeignKey(e => e.IdGender)
            .OnDelete(DeleteBehavior.Restrict);

        builder.ConfigureAuditColumns();
        builder.HasQueryFilter(e => e.IsActive);
    }
}
