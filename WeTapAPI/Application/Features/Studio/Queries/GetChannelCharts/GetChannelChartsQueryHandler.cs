using Application.Interfaces;
using Application.Models.Statistics;
using Domain.Entities.Channel;
using Domain.Entities.Video;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Studio.Queries.GetChannelCharts;

public class GetChannelChartsQueryHandler(
    IGenericRepository<ChannelEntity, long> channelRepo,
    IGenericRepository<VideoEntity, long> videoRepo)
    : IRequestHandler<GetChannelChartsQuery, IEnumerable<ChannelChartModel>>
{
    public async Task<IEnumerable<ChannelChartModel>> Handle(
        GetChannelChartsQuery request,
        CancellationToken cancellationToken)
    {
        var from = DateTime.SpecifyKind(request.From.Date, DateTimeKind.Utc);
        var to   = DateTime.SpecifyKind(request.To.Date.AddDays(1), DateTimeKind.Utc);

        // --- Views: group VideoEntity.DateCreated by day, sum ViewCount ---
        var viewsData = await videoRepo.AsQurable()
            .Where(v => v.ChannelId == request.ChannelId
                     && !v.IsDeleted
                     && v.DateCreated >= from
                     && v.DateCreated < to)
            .GroupBy(v => v.DateCreated.Date)
            .Select(g => new ChartDataPointModel
            {
                Date  = g.Key.ToString("yyyy-MM-dd"),
                Value = g.Sum(v => v.ViewCount)
            })
            .OrderBy(p => p.Date)
            .ToListAsync(cancellationToken);

        // --- Subscribers: group ChannelSubscriberEntity.DateSubscribed by day ---
        var subscribersData = await channelRepo.AsQurable()
            .Where(c => c.Id == request.ChannelId)
            .SelectMany(c => c.Subscribers!)
            .Where(s => s.DateSubscribed >= from && s.DateSubscribed < to)
            .GroupBy(s => s.DateSubscribed.Date)
            .Select(g => new ChartDataPointModel
            {
                Date  = g.Key.ToString("yyyy-MM-dd"),
                Value = g.Count()
            })
            .OrderBy(p => p.Date)
            .ToListAsync(cancellationToken);

        // --- Likes: group VideoReactionEntity.DateCreated by day, count likes ---
        var likesData = await videoRepo.AsQurable()
            .Where(v => v.ChannelId == request.ChannelId && !v.IsDeleted)
            .SelectMany(v => v.VideoReactions)
            .Where(r => r.IsLike && r.DateCreated >= from && r.DateCreated < to)
            .GroupBy(r => r.DateCreated.Date)
            .Select(g => new ChartDataPointModel
            {
                Date  = g.Key.ToString("yyyy-MM-dd"),
                Value = g.Count()
            })
            .OrderBy(p => p.Date)
            .ToListAsync(cancellationToken);

        return
        [
            new ChannelChartModel { Metric = ChartMetricType.Views,       DataPoints = viewsData       },
            new ChannelChartModel { Metric = ChartMetricType.Subscribers,  DataPoints = subscribersData },
            new ChannelChartModel { Metric = ChartMetricType.Likes,        DataPoints = likesData       },
        ];
    }
}
