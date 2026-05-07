using Domain;
using Domain.Entities.Channel;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Channel.Commands.ToggleChannelSubscription;

public class ToggleChannelSubscriptionHandler(AppDbContext context) : IRequestHandler<ToggleChannelSubscriptionCommand>
{
    public async Task Handle(ToggleChannelSubscriptionCommand request, CancellationToken cancellationToken)
    {
        long userId = 1; // змінити
        long channelId = request.Model.ChannelId;

        // Користувач не може підписуватись сам на себе
        if (channelId == userId)
        {
            throw new Exception("Ви не можете підписатися на власний канал");
        }

        var channelExists = await context.Channels.AnyAsync(x => x.Id == channelId && !x.IsDeleted, cancellationToken);
        if (!channelExists)
        {
            throw new Exception("Канал не знайдено");
        }

        var subscription = await context.ChannelSubscribers
            .FirstOrDefaultAsync(x => x.ChannelId == channelId && x.UserId == userId, cancellationToken);

        if (subscription != null)
        {
            // Якщо вже підписаний - відписуємось
            context.ChannelSubscribers.Remove(subscription);
        }
        else
        {
            // Якщо не підписаний - підписуємось
            var newSubscription = new ChannelSubscriberEntity
            {
                ChannelId = channelId,
                UserId = userId,
                DateSubscribed = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc)
            };
            await context.ChannelSubscribers.AddAsync(newSubscription, cancellationToken);
        }

        await context.SaveChangesAsync(cancellationToken);
    }
}
