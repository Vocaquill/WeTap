using Application.Models.Language;
using Domain;
using Domain.Entities.Language;
using FluentValidation;
using Application.Validators.Extensions;

namespace Application.Validators.Language;

public class LanguageUpdateModelValidator : AbstractValidator<LanguageUpdateModel>
{
    public LanguageUpdateModelValidator(AppDbContext db)
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Id повинен бути більше 0")
            .MustExistAsync<LanguageUpdateModel, VideoLanguageEntity, long>(db, "Мову не знайдено");

        RuleFor(x => x.Name)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Назва є обов'язковою")
            .MaximumLength(50).WithMessage("Назва повинна містити не більше 50 символів");

        RuleFor(x => x.LanguageCode)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Код мови є обов'язковим")
            .MaximumLength(50).WithMessage("Код мови повинен містити не більше 50 символів")
            .UniquePropertyUpdateAsync<LanguageUpdateModel, VideoLanguageEntity, long>(db, "LanguageCode", x => x.Id, "Інша мова з таким кодом вже існує");
    }
}
