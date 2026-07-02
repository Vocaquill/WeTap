using Application.Models.Statistics;
using MediatR;

namespace Application.Features.Studio.Queries.GetChannelOverview;

public record GetChannelOverviewQuery(long? ChannelId) : IRequest<ChannelStatisticsModel>;
