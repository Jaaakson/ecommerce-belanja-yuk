using BelanjaYuk.Infrastructure.Persistence.Seeding;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace BelanjaYuk.Infrastructure.Persistence.Extensions;

public static class DatabaseInitializerExtensions
{
    /// <summary>
    /// Applies pending migrations and seeds reference data.
    /// Called at startup so a fresh container becomes usable without manual steps.
    /// </summary>
    public static async Task InitializeDatabaseAsync(this IServiceProvider services)
    {
        using var scope = services.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await context.Database.MigrateAsync();

        var seeder = new DatabaseSeeder(context);
        await seeder.SeedAsync();
    }
}
