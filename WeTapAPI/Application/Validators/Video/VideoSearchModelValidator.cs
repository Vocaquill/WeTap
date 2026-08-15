using Application.Models.Video;
using FluentValidation;

namespace Application.Validators.Video;

public class VideoSearchModelValidator : AbstractValidator<VideoSearchModel>
{
    public VideoSearchModelValidator()
    {
        RuleFor(x => x.Page)
            .GreaterThanOrEqualTo(1).WithMessage("Номер сторінки повинен бути більше або дорівнювати 1");

        RuleFor(x => x.ItemPerPage)
            .InclusiveBetween(1, 100).WithMessage("Кількість елементів на сторінці повинна бути від 1 до 100");

        RuleFor(x => x.Q)
            .MaximumLength(100).WithMessage("Пошуковий запит повинен бути не більше 100 символів");

        RuleFor(x => x.Title)
            .MaximumLength(100).WithMessage("Назва повинна бути не більше 100 символів");

        RuleFor(x => x.ChannelName)
            .MaximumLength(100).WithMessage("Назва каналу повинна бути не більше 100 символів");

        RuleFor(x => x.CreateYearFrom)
            .Must(year => string.IsNullOrEmpty(year) || int.TryParse(year, out _))
            .WithMessage("Рік 'від' повинен бути числовим значенням");

        RuleFor(x => x.CreateYearTo)
            .Must(year => string.IsNullOrEmpty(year) || int.TryParse(year, out _))
            .WithMessage("Рік 'до' повинен бути числовим значенням");

        RuleFor(x => x.SortBy)
            .Must(sortBy => string.IsNullOrEmpty(sortBy) || new[] { "date", "views", "rating", "likes", "reactions" }.Contains(sortBy.ToLower()))
            .WithMessage("Обрано недопустиме поле для сортування, доступні такі поля: date, views, rating, likes, reactions");
    }
}
