namespace BelanjaYuk.Api.Common;

/// <summary>
/// Envelope applied to every endpoint so the SPA can branch on a single shape
/// instead of inspecting status codes per call.
/// </summary>
public record ApiResponse<T>(bool Success, string Message, T? Data)
{
    public static ApiResponse<T> Ok(T data, string message = "Berhasil.") =>
        new(true, message, data);
}

public record ApiError(bool Success, string Message, IDictionary<string, string[]>? Errors)
{
    public static ApiError Create(string message, IDictionary<string, string[]>? errors = null) =>
        new(false, message, errors);
}
