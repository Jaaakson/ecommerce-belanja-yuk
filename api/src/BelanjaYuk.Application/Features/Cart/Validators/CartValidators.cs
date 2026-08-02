using BelanjaYuk.Application.Features.Cart.Dtos;

using FluentValidation;

namespace BelanjaYuk.Application.Features.Cart.Validators;

public class AddToCartRequestValidator : AbstractValidator<AddToCartRequest>
{
    public AddToCartRequestValidator()
    {
        RuleFor(x => x.IdProduct)
            .NotEmpty().WithMessage("Produk wajib dipilih.");

        RuleFor(x => x.Qty)
            .InclusiveBetween(1, 99).WithMessage("Jumlah barang minimal 1 dan maksimal 99.");
    }
}

public class UpdateCartItemRequestValidator : AbstractValidator<UpdateCartItemRequest>
{
    public UpdateCartItemRequestValidator()
    {
        RuleFor(x => x.Qty)
            .InclusiveBetween(1, 99).WithMessage("Jumlah barang minimal 1 dan maksimal 99.");
    }
}
