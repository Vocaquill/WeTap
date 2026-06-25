using Application.Models.Statistics;
using MediatR;

namespace Application.Features.Studio.Queries.GetChannelCharts;

public record GetChannelChartsQuery(
    long ChannelId,
    DateTime From,
    DateTime To
) : IRequest<IEnumerable<ChannelChartModel>>;
