using Application.Models.Language;
using Domain;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.Validators.Language;

public class LanguageDeleteModelValidator : AbstractValidator<LanguageDeleteModel>
{
    public LanguageDeleteModelValidator(AppDbContext db)
    {
        RuleFor(x => x.Ids)
            .NotEmpty().WithMessage("Список Id не може бути порожнім")
            .MustAsync(async (ids, cancellation) =>
            {
                var count = await db.VideoLanguages.CountAsync(l => ids.Contains(l.Id), cancellation);
                return count == ids.Distinct().Count();
            })
            .WithMessage("Одну або кілька мов не знайдено");
    }
}
