using Application.Interfaces;
using Application.Models.Statistics;
using Domain.Entities.Channel;
using Domain.Entities.Video;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Studio.Queries.GetChannelCharts;

public class GetChannelChartsQueryHandler(
    IGenericRepository<ChannelEntity, long> channelRepo,
    IGenericRepository<VideoEntity, long> videoRepo,
    ICurrentUserService currentUserService)
    : IRequestHandler<GetChannelChartsQuery, IEnumerable<ChannelChartModel>>
{
    public async Task<IEnumerable<ChannelChartModel>> Handle(
        GetChannelChartsQuery request,
        CancellationToken cancellationToken)
    {
        long targetChannelId = request.Model.ChannelId.HasValue && request.Model.ChannelId != 0
            ? request.Model.ChannelId.Value
            : currentUserService.GetCurrentUserId();

        var from = DateTime.SpecifyKind(request.Model.From.Date, DateTimeKind.Utc);
        var to = DateTime.SpecifyKind(request.Model.To.Date.AddDays(1), DateTimeKind.Utc);

        var viewsDataRaw = await videoRepo.AsQurable()
            .Where(v => v.ChannelId == targetChannelId && !v.IsDeleted && v.DateCreated >= from && v.DateCreated < to)
            .GroupBy(v => v.DateCreated.Date)
            .Select(g => new { Date = g.Key, Value = g.Sum(v => v.ViewCount) })
            .ToListAsync(cancellationToken);

        var subscribersDataRaw = await channelRepo.AsQurable()
            .Where(c => c.Id == targetChannelId)
            .SelectMany(c => c.Subscribers!)
            .Where(s => s.DateSubscribed >= from && s.DateSubscribed < to)
            .GroupBy(s => s.DateSubscribed.Date)
            .Select(g => new { Date = g.Key, Value = g.Count() })
            .ToListAsync(cancellationToken);

        var likesDataRaw = await videoRepo.AsQurable()
            .Where(v => v.ChannelId == targetChannelId && !v.IsDeleted)
            .SelectMany(v => v.VideoReactions)
            .Where(r => r.IsLike && r.DateCreated >= from && r.DateCreated < to)
            .GroupBy(r => r.DateCreated.Date)
            .Select(g => new { Date = g.Key, Value = g.Count() })
            .ToListAsync(cancellationToken);

        var viewsData = ToChartDataPoints(viewsDataRaw, x => x.Date, x => (int)x.Value);
        var subscribersData = ToChartDataPoints(subscribersDataRaw, x => x.Date, x => x.Value);
        var likesData = ToChartDataPoints(likesDataRaw, x => x.Date, x => x.Value);

        return
        [
            new ChannelChartModel { Metric = ChartMetricType.Views,       DataPoints = viewsData       },
            new ChannelChartModel { Metric = ChartMetricType.Subscribers,  DataPoints = subscribersData },
            new ChannelChartModel { Metric = ChartMetricType.Likes,        DataPoints = likesData       },
        ];
    }

    private static List<ChartDataPointModel> ToChartDataPoints<T>(
        IEnumerable<T> source,
        Func<T, DateTime> dateSelector,
        Func<T, int> valueSelector)
    {
        return source
            .Select(x => new ChartDataPointModel
            {
                Date = dateSelector(x).ToString("yyyy-MM-dd"),
                Value = valueSelector(x)
            })
            .OrderBy(p => p.Date)
            .ToList();
    }
}