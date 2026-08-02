using System.Text.Json;

using BelanjaYuk.Api.Common;
using BelanjaYuk.Application.Common.Exceptions;

using ValidationException = BelanjaYuk.Application.Common.Exceptions.ValidationException;

namespace BelanjaYuk.Api.Middleware;

/// <summary>
/// Translates application exceptions into HTTP responses so controllers stay
/// free of try/catch blocks and error shapes remain consistent across endpoints.
/// </summary>
public class ExceptionHandlingMiddleware(
    RequestDelegate next,
    ILogger<ExceptionHandlingMiddleware> logger)
{
    private static readonly JsonSerializerOptions SerializerOptions =
        new(JsonSerializerDefaults.Web);

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception exception)
        {
            await HandleAsync(context, exception);
        }
    }

    private async Task HandleAsync(HttpContext context, Exception exception)
    {
        var (statusCode, payload) = exception switch
        {
            ValidationException validation => (
                StatusCodes.Status400BadRequest,
                ApiError.Create(validation.Message, validation.Errors)),

            ConflictException conflict => (
                StatusCodes.Status409Conflict,
                ApiError.Create(conflict.Message)),

            UnauthorizedException unauthorized => (
                StatusCodes.Status401Unauthorized,
                ApiError.Create(unauthorized.Message)),

            _ => (
                StatusCodes.Status500InternalServerError,
                ApiError.Create("Terjadi kesalahan pada server."))
        };

        // Unexpected failures are logged in full; handled ones are expected
        // control flow and would only add noise.
        if (statusCode == StatusCodes.Status500InternalServerError)
        {
            logger.LogError(exception, "Unhandled exception on {Method} {Path}",
                context.Request.Method, context.Request.Path);
        }

        context.Response.Clear();
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";

        await context.Response.WriteAsync(
            JsonSerializer.Serialize(payload, SerializerOptions));
    }
}
