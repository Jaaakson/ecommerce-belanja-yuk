using BelanjaYuk.Application.Features.Auth.Services;
using BelanjaYuk.Application.Features.Lookups.Services;
using BelanjaYuk.Application.Features.Products.Services;

using System.Reflection;

using FluentValidation;

using Microsoft.Extensions.DependencyInjection;

namespace BelanjaYuk.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        services.AddScoped<IAuthService, AuthService>();

        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<ILookupService, LookupService>();

        return services;
    }
}
