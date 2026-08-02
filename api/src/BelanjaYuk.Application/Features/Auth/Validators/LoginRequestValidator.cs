using BelanjaYuk.Application.Features.Auth.Dtos;

using FluentValidation;

namespace BelanjaYuk.Application.Features.Auth.Validators;

public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Identifier)
            .NotEmpty().WithMessage("Email atau nomor HP wajib diisi.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Kata sandi wajib diisi.");
    }
}
