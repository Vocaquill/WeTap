using Application.Models.Channel;
using FluentValidation;

namespace Application.Validators.Channel;

public class ChannelSearchModelValidator : AbstractValidator<ChannelSearchModel>
{
    public ChannelSearchModelValidator()
    {
        RuleFor(x => x.Page)
            .GreaterThanOrEqualTo(1).WithMessage("Номер сторінки повинен бути більше або дорівнювати 1");

        RuleFor(x => x.ItemPerPage)
            .InclusiveBetween(1, 100).WithMessage("Кількість елементів на сторінці повинна бути від 1 до 100");

        RuleFor(x => x.Q)
            .MaximumLength(100).WithMessage("Пошуковий запит повинен бути не більше 100 символів");
    }
}
