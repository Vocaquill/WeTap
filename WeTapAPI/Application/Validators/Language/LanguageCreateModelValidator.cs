using Application.Models.Language;
using Domain;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.Validators.Language;

public class LanguageCreateModelValidator : AbstractValidator<LanguageCreateModel>
{
    public LanguageCreateModelValidator(AppDbContext db)
    {
        RuleFor(x => x.Name)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Назва є обов'язковою")
            .MaximumLength(50).WithMessage("Назва повинна містити не більше 50 символів");

        RuleFor(x => x.LanguageCode)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Код мови є обов'язковим")
            .MaximumLength(50).WithMessage("Код мови повинен містити не більше 50 символів")
            .MustAsync(async (code, cancellation) =>
            {
                return !await db.VideoLanguages.AnyAsync(l => l.LanguageCode == code, cancellation);
            })
            .WithMessage("Мова з таким кодом вже існує");
    }
}
