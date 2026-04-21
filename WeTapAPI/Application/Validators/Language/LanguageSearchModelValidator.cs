using Application.Models.Language;
using FluentValidation;

namespace Application.Validators.Language;

public class LanguageSearchModelValidator : AbstractValidator<LanguageSearchModel>
{
    public LanguageSearchModelValidator()
    {
        RuleFor(x => x.Page)
            .GreaterThanOrEqualTo(1).WithMessage("Номер сторінки повинен бути більше або дорівнювати 1");

        RuleFor(x => x.ItemPerPage)
            .InclusiveBetween(1, 100).WithMessage("Кількість елементів на сторінці повинна бути від 1 до 100");

        RuleFor(x => x.Name)
            .MaximumLength(100).WithMessage("Назва повинна бути не більше 100 символів");
    }
}
