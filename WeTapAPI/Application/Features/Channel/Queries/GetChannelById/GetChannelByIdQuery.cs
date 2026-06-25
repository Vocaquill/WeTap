using Application.Models.Channel;
using MediatR;

namespace Application.Features.Channel.Queries.GetChannelById;

public record GetChannelByIdQuery(long Id) : IRequest<ChannelItemModel>;