using BelanjaYuk.Domain.Entities;
using BelanjaYuk.Infrastructure.Persistence.Extensions;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BelanjaYuk.Infrastructure.Persistence.Configurations;

public class LtGenderConfiguration : IEntityTypeConfiguration<LtGender>
{
    public void Configure(EntityTypeBuilder<LtGender> builder)
    {
        builder.ToTable("LtGender");

        builder.HasKey(e => e.IdGender);

        builder.Property(e => e.IdGender).HasColumnType("nvarchar(36)").ValueGeneratedNever();
        builder.Property(e => e.GenderName).HasColumnType("nvarchar(50)").IsRequired();

        builder.ConfigureAuditColumns();
    }
}
