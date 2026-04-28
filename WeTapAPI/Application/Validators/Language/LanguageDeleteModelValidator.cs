using Application.Models.Language;
using Domain;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.Validators.Language;

public class LanguageDeleteModelValidator : AbstractValidator<LanguageDeleteModel>
{
    public LanguageDeleteModelValidator(AppDbContext db)
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Id повинен бути більше 0")
            .MustAsync(async (id, cancellation) =>
                await db.VideoLanguages.AnyAsync(
                    t => t.Id == id && !t.IsDeleted,
                    cancellation))
            .WithMessage("Мову не знайдено");
    }
}
