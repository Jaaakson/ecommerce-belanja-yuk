using BelanjaYuk.Application.Features.Auth.Services;

using FluentValidation;
using System.Reflection;
using Microsoft.Extensions.DependencyInjection;

namespace BelanjaYuk.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        services.AddScoped<IAuthService, AuthService>();

        return services;
    }
}
