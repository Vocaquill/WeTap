using Application.Models.Channel;
using Application.Models.Search;
using MediatR;

namespace Application.Features.Channel.Queries.SearchChannels;

public record SearchChannelsQuery(ChannelSearchModel Model) : IRequest<SearchResult<ChannelItemModel>>;
