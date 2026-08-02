using BelanjaYuk.Infrastructure.Persistence;
using BelanjaYuk.Infrastructure.Persistence.Interceptors;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BelanjaYuk.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddScoped<AuditableEntityInterceptor>();

        services.AddDbContext<AppDbContext>((serviceProvider, options) =>
        {
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
            options.AddInterceptors(serviceProvider.GetRequiredService<AuditableEntityInterceptor>());
        });

        return services;
    }
}
