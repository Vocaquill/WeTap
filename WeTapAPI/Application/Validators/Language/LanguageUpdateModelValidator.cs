using Application.Models.Language;
using Domain;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.Validators.Language;

public class LanguageUpdateModelValidator : AbstractValidator<LanguageUpdateModel>
{
    public LanguageUpdateModelValidator(AppDbContext db)
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Id повинен бути більше 0")
            .MustAsync(async (id, cancellation) =>
                await db.VideoLanguages.AnyAsync(l => l.Id == id, cancellation))
            .WithMessage("Мову не знайдено");

        RuleFor(x => x.Name)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Назва є обов'язковою")
            .MaximumLength(50).WithMessage("Назва повинна містити не більше 50 символів");

        RuleFor(x => x.LanguageCode)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Код мови є обов'язковим")
            .MaximumLength(50).WithMessage("Код мови повинен містити не більше 50 символів")
            .MustAsync(async (model, code, cancellation) =>
            {
                return !await db.VideoLanguages.AnyAsync(
                    l => l.LanguageCode == code && l.Id != model.Id, 
                    cancellation);
            })
            .WithMessage("Інша мова з таким кодом вже існує");
    }
}
