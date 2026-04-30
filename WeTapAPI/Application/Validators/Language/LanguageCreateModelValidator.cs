using Application.Models.Language;
using Domain;
using Domain.Entities.Language;
using FluentValidation;
using Application.Validators.Extensions;

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
            .UniquePropertyAsync<LanguageCreateModel, VideoLanguageEntity, long>(db, "LanguageCode", "Мова з таким кодом вже існує");
    }
}
