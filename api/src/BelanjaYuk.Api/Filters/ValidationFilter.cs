using FluentValidation;

using Microsoft.AspNetCore.Mvc.Filters;

using ValidationException = BelanjaYuk.Application.Common.Exceptions.ValidationException;

namespace BelanjaYuk.Api.Filters;

/// <summary>
/// Runs the FluentValidation validator registered for each action argument.
/// Without this, validators would have to be invoked manually in every action.
/// </summary>
public class ValidationFilter(IServiceProvider serviceProvider) : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(
        ActionExecutingContext context,
        ActionExecutionDelegate next)
    {
        foreach (var argument in context.ActionArguments.Values)
        {
            if (argument is null)
            {
                continue;
            }

            var validatorType = typeof(IValidator<>).MakeGenericType(argument.GetType());

            if (serviceProvider.GetService(validatorType) is not IValidator validator)
            {
                continue;
            }

            var validationContext = new ValidationContext<object>(argument);
            var result = await validator.ValidateAsync(validationContext, context.HttpContext.RequestAborted);

            if (result.IsValid)
            {
                continue;
            }

            var errors = result.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());

            throw new ValidationException(errors);
        }

        await next();
    }
}
