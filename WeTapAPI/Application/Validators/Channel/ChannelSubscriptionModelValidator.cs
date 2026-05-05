using Application.Models.Channel;
using FluentValidation;

namespace Application.Validators.Channel;

public class ChannelSubscriptionModelValidator : AbstractValidator<ChannelSubscriptionModel>
{
    public ChannelSubscriptionModelValidator()
    {
        RuleFor(x => x.ChannelId)
            .GreaterThan(0).WithMessage("ID каналу повинен бути більше 0");
    }
}
