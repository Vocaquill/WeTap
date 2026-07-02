using Application.Models.Statistics;
using MediatR;

namespace Application.Features.Studio.Queries.GetChannelCharts;

public record GetChannelChartsQuery(GetChannelChartsModel Model) : IRequest<IEnumerable<ChannelChartModel>>;