using BelanjaYuk.Domain.Entities;

using Microsoft.EntityFrameworkCore;

namespace BelanjaYuk.Application.Common.Interfaces;

/// <summary>
/// Database surface exposed to the application layer.
/// EF Core already provides Unit of Work (SaveChanges) and Repository (DbSet),
/// so this interface exists only to keep the dependency direction correct —
/// not to reimplement those patterns.
/// </summary>
public interface IAppDbContext
{
    DbSet<LtGender> LtGenders { get; }
    DbSet<LtCategory> LtCategories { get; }
    DbSet<LtPayment> LtPayments { get; }
    DbSet<MsProduct> MsProducts { get; }
    DbSet<MsUser> MsUsers { get; }
    DbSet<MsUserPassword> MsUserPasswords { get; }
    DbSet<MsUserSeller> MsUserSellers { get; }
    DbSet<TrBuyerCart> TrBuyerCarts { get; }
    DbSet<TrBuyerTransaction> TrBuyerTransactions { get; }
    DbSet<TrBuyerTransactionDetail> TrBuyerTransactionDetails { get; }
    DbSet<TrHomeAddress> TrHomeAddresses { get; }
    DbSet<TrProductImages> TrProductImages { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
