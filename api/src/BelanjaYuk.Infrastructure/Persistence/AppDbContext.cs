using BelanjaYuk.Domain.Entities;

using Microsoft.EntityFrameworkCore;

namespace BelanjaYuk.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    // Lookup tables (Lt*)
    public DbSet<LtCategory> LtCategories => Set<LtCategory>();
    public DbSet<LtGender> LtGenders => Set<LtGender>();
    public DbSet<LtPayment> LtPayments => Set<LtPayment>();

    // Master tables (Ms*)
    public DbSet<MsProduct> MsProducts => Set<MsProduct>();
    public DbSet<MsUser> MsUsers => Set<MsUser>();
    public DbSet<MsUserPassword> MsUserPasswords => Set<MsUserPassword>();
    public DbSet<MsUserSeller> MsUserSellers => Set<MsUserSeller>();

    // Transaction tables (Tr*)
    public DbSet<TrBuyerCart> TrBuyerCarts => Set<TrBuyerCart>();
    public DbSet<TrBuyerTransaction> TrBuyerTransactions => Set<TrBuyerTransaction>();
    public DbSet<TrBuyerTransactionDetail> TrBuyerTransactionDetails => Set<TrBuyerTransactionDetail>();
    public DbSet<TrHomeAddress> TrHomeAddresses => Set<TrHomeAddress>();
    public DbSet<TrProductImages> TrProductImages => Set<TrProductImages>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
