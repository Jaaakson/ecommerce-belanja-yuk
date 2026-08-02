using BelanjaYuk.Application.Features.Products.Dtos;

using FluentValidation;

namespace BelanjaYuk.Application.Features.Products.Validators;

public class ProductQueryValidator : AbstractValidator<ProductQuery>
{
    // The specification forbids whitespace-only searches and these symbols.
    private static readonly char[] ForbiddenCharacters = ['<', '>', '/', '{', '}'];

    public ProductQueryValidator()
    {
        RuleFor(x => x.Search)
            .Must(search => !string.IsNullOrEmpty(search) && !string.IsNullOrWhiteSpace(search))
            .WithMessage("Kata kunci pencarian tidak boleh hanya berisi spasi.")
            .When(x => x.Search is not null);

        RuleFor(x => x.Search)
            .Must(search => search!.IndexOfAny(ForbiddenCharacters) < 0)
            .WithMessage("Kata kunci pencarian mengandung simbol yang tidak diizinkan.")
            .When(x => !string.IsNullOrWhiteSpace(x.Search));

        RuleFor(x => x.Page)
            .GreaterThan(0).WithMessage("Halaman minimal 1.");

        RuleFor(x => x.PageSize)
            .InclusiveBetween(1, 50).WithMessage("Ukuran halaman harus antara 1 dan 50.");
    }
}
