using BelanjaYuk.Application.Common.Interfaces;
using BelanjaYuk.Domain.Common;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace BelanjaYuk.Infrastructure.Persistence.Interceptors;

/// <summary>
/// Fills the audit columns defined by the BelanjaYuk ERD on every save,
/// so services never have to set them by hand.
/// </summary>
public class AuditableEntityInterceptor(ICurrentUserService currentUserService) : SaveChangesInterceptor
{
    private const string SystemUser = "SYSTEM";

    public override InterceptionResult<int> SavingChanges(
        DbContextEventData eventData,
        InterceptionResult<int> result)
    {
        ApplyAuditInformation(eventData.Context);
        return base.SavingChanges(eventData, result);
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        ApplyAuditInformation(eventData.Context);
        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private void ApplyAuditInformation(DbContext? context)
    {
        if (context is null)
        {
            return;
        }

        var actor = currentUserService.UserId ?? SystemUser;
        var timestamp = DateTime.UtcNow;

        foreach (var entry in context.ChangeTracker.Entries<AuditableEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.DateIn = timestamp;
                    entry.Entity.UserIn = actor;
                    break;

                case EntityState.Modified:
                    entry.Entity.DateUp = timestamp;
                    entry.Entity.UserUp = actor;
                    entry.Property(e => e.DateIn).IsModified = false;
                    entry.Property(e => e.UserIn).IsModified = false;
                    break;
            }
        }
    }
}
