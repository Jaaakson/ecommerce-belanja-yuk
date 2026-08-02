namespace BelanjaYuk.Application.Features.Products.Dtos;

public record ProductQuery
{
    public string? Search { get; init; }
    public string? IdCategory { get; init; }
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 12;
}
