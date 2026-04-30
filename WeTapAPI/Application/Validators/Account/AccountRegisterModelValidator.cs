using Application.Models.Account;
using FluentValidation;
using Application.Validators.Extensions;

namespace Application.Validators.Account;

public class AccountRegisterModelValidator : AbstractValidator<AccountRegisterModel>
{
    public AccountRegisterModelValidator()
    {
        RuleFor(x => x.ImageFile)
            .IsImage();
    }
}
