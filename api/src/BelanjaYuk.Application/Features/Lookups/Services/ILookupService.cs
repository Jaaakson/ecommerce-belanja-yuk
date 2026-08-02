using BelanjaYuk.Application.Features.Lookups.Dtos;

namespace BelanjaYuk.Application.Features.Lookups.Services;

public interface ILookupService
{
    Task<IReadOnlyList<LookupItem>> GetCategoriesAsync(CancellationToken cancellationToken = default);

    Task<IReadOnlyList<LookupItem>> GetGendersAsync(CancellationToken cancellationToken = default);

    Task<IReadOnlyList<LookupItem>> GetPaymentsAsync(CancellationToken cancellationToken = default);
}
