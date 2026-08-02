using BelanjaYuk.Application.Features.Checkout.Dtos;

using FluentValidation;

namespace BelanjaYuk.Application.Features.Checkout.Validators;

public class CheckoutRequestValidator : AbstractValidator<CheckoutRequest>
{
    public CheckoutRequestValidator()
    {
        RuleFor(x => x.IdPayment)
            .NotEmpty().WithMessage("Metode pembayaran wajib dipilih.");
    }
}
