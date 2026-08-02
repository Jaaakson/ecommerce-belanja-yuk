using BelanjaYuk.Application.Common.Interfaces;
using BelanjaYuk.Application.Features.Lookups.Dtos;

using Microsoft.EntityFrameworkCore;

namespace BelanjaYuk.Application.Features.Lookups.Services;

/// <summary>
/// Lookup tables are excluded from the global soft-delete filter, so IsActive
/// is applied explicitly here: only selectable options should reach the client,
/// while historical rows referencing a deactivated option stay intact.
/// </summary>
public class LookupService(IAppDbContext context) : ILookupService
{
    public async Task<IReadOnlyList<LookupItem>> GetCategoriesAsync(CancellationToken cancellationToken = default) =>
        await context.LtCategories
            .AsNoTracking()
            .Where(c => c.IsActive)
            .OrderBy(c => c.CategoryName)
            .Select(c => new LookupItem(c.IdCategory, c.CategoryName))
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<LookupItem>> GetGendersAsync(CancellationToken cancellationToken = default) =>
        await context.LtGenders
            .AsNoTracking()
            .Where(g => g.IsActive)
            .OrderBy(g => g.GenderName)
            .Select(g => new LookupItem(g.IdGender, g.GenderName))
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<LookupItem>> GetPaymentsAsync(CancellationToken cancellationToken = default) =>
        await context.LtPayments
            .AsNoTracking()
            .Where(p => p.IsActive)
            .OrderBy(p => p.PaymentName)
            .Select(p => new LookupItem(p.IdPayment, p.PaymentName))
            .ToListAsync(cancellationToken);
}
