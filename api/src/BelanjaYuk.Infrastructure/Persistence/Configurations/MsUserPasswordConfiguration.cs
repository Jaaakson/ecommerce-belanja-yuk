using BelanjaYuk.Domain.Entities;
using BelanjaYuk.Infrastructure.Persistence.Extensions;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BelanjaYuk.Infrastructure.Persistence.Configurations;

public class MsUserPasswordConfiguration : IEntityTypeConfiguration<MsUserPassword>
{
    public void Configure(EntityTypeBuilder<MsUserPassword> builder)
    {
        builder.ToTable("MsUserPassword");

        builder.HasKey(e => e.IdUserPassword);

        builder.Property(e => e.IdUserPassword).HasColumnType("nvarchar(36)").ValueGeneratedNever();
        builder.Property(e => e.IdUser).HasColumnType("nvarchar(36)").IsRequired();
        builder.Property(e => e.PasswordHash).HasColumnType("nvarchar(200)").IsRequired();

        builder.HasOne(e => e.User)
            .WithOne(u => u.Password)
            .HasForeignKey<MsUserPassword>(e => e.IdUser)
            .OnDelete(DeleteBehavior.Restrict);

        builder.ConfigureAuditColumns();
        builder.HasQueryFilter(e => e.IsActive);
    }
}
