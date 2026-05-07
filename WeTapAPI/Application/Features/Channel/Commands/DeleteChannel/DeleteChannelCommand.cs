using Application.Models.Channel;
using MediatR;

namespace Application.Features.Channel.Commands.DeleteChannel;

public record DeleteChannelCommand(ChannelDeleteModel Model) : IRequest;
