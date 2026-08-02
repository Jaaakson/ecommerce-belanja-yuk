namespace BelanjaYuk.Application.Common.Exceptions;

public class ValidationException(IDictionary<string, string[]> errors)
    : Exception("Satu atau lebih input tidak valid.")
{
    public IDictionary<string, string[]> Errors { get; } = errors;
}
