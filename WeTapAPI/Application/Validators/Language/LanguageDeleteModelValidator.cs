using Application.Models.Language;
using Domain;
using Domain.Entities.Language;
using FluentValidation;
using Application.Validators.Extensions;

namespace Application.Validators.Language;

public class LanguageDeleteModelValidator : AbstractValidator<LanguageDeleteModel>
{
    public LanguageDeleteModelValidator(AppDbContext db)
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Id повинен бути більше 0")
            .MustExistAsync<LanguageDeleteModel, VideoLanguageEntity, long>(db, "Мову не знайдено");
    }
}
