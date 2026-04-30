using FluentValidation;
using Application.Validators.Extensions;
using Application.Models.Genre;

namespace Application.Validators.Genre;

public class GenreSearchModelValidator : AbstractValidator<GenreSearchModel>
{
    public GenreSearchModelValidator()
    {
        RuleFor(x => x.Page)
            .GreaterThanOrEqualTo(1).WithMessage("Номер сторінки повинен бути більше або дорівнювати 1");

        RuleFor(x => x.ItemPerPage)
            .InclusiveBetween(1, 100).WithMessage("Кількість елементів на сторінці повинна бути від 1 до 100");

        RuleFor(x => x.Q)
            .MaximumLength(100).WithMessage("Пошуковий запит повинен бути не більше 100 символів");

        RuleFor(x => x.Name)
            .MaximumLength(100).WithMessage("Назва повинна бути не більше 100 символів");

        RuleFor(x => x.Slug!)
            .MaximumLength(100).WithMessage("Slug повинен бути не більше 100 символів")
            .IsSlug();

        RuleFor(x => x.SortBy)
            .Must(sortBy => string.IsNullOrEmpty(sortBy) || new[] { "name", "slug" }.Contains(sortBy.ToLower()))
            .WithMessage("Обрано недопустиме поле для сортування, доступні такі поля: name, slug");
    }
}
