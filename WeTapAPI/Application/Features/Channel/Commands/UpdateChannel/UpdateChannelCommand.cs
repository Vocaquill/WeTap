using Application.Models.Channel;
using MediatR;

namespace Application.Features.Channel.Commands.UpdateChannel;

public record UpdateChannelCommand(ChannelUpdateModel Model) : IRequest<ChannelItemModel>;
