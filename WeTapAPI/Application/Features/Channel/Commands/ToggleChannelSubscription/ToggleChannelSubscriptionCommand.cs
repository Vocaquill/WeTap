using Application.Models.Channel;
using MediatR;

namespace Application.Features.Channel.Commands.ToggleChannelSubscription;

public record ToggleChannelSubscriptionCommand(ChannelSubscriptionModel Model) : IRequest;
