using Application.Interfaces;
using Application.Mappings;
using Application.Models.Statistics;
using Application.Models.Video;
using Domain.Entities.Channel;
using Domain.Entities.Identity;
using Domain.Entities.Video;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Studio.Queries.GetChannelOverview;

public class GetChannelOverviewQueryHandler(
    IGenericRepository<ChannelEntity, long> channelRepo,
    IGenericRepository<VideoEntity, long> videoRepo,
    UserManager<UserEntity> userManager,
    ICurrentUserService currentUserService,
    ChannelMappingProfile channelMapper,
    VideoMappingProfile videoMapper)
    : IRequestHandler<GetChannelOverviewQuery, ChannelStatisticsModel>
{
    public async Task<ChannelStatisticsModel> Handle(
        GetChannelOverviewQuery request,
        CancellationToken cancellationToken)
    {
        long targetChannelId = request.ChannelId.HasValue && request.ChannelId != 0
            ? request.ChannelId.Value
            : currentUserService.GetCurrentUserId();

        var monthAgo = DateTime.UtcNow.AddMonths(-1);

        // Overview aggregates
        var subscriberCount = await channelRepo.AsQurable()
            .Where(c => c.Id == targetChannelId)
            .SelectMany(c => c.Subscribers!)
            .LongCountAsync(cancellationToken);

        var totalViewCount = await videoRepo.AsQurable()
            .Where(v => v.ChannelId == targetChannelId && !v.IsDeleted)
            .SumAsync(v => v.ViewCount, cancellationToken);

        var monthlyViewCount = await videoRepo.AsQurable()
            .Where(v => v.ChannelId == targetChannelId && !v.IsDeleted && v.DateCreated >= monthAgo)
            .SumAsync(v => v.ViewCount, cancellationToken);

        var totalVideoCount = await videoRepo.AsQurable()
            .LongCountAsync(v => v.ChannelId == targetChannelId && !v.IsDeleted, cancellationToken);

        var totalLikesCount = await videoRepo.AsQurable()
            .Where(v => v.ChannelId == targetChannelId && !v.IsDeleted)
            .SelectMany(v => v.VideoReactions)
            .LongCountAsync(r => r.IsLike, cancellationToken);

        var averageViewsPerVideo = totalVideoCount == 0
            ? 0
            : Math.Round((double)totalViewCount / totalVideoCount, 2);

        var overview = new ChannelOverviewModel
        {
            SubscriberCount    = subscriberCount,
            TotalViewCount     = totalViewCount,
            MonthlyViewCount   = monthlyViewCount,
            TotalVideoCount    = totalVideoCount,
            TotalLikesCount    = totalLikesCount,
            AverageViewsPerVideo = averageViewsPerVideo
        };

        var recentSubscribersRaw = await channelRepo.AsQurable()
            .Where(c => c.Id == targetChannelId)
            .SelectMany(c => c.Subscribers!)
            .Include(s => s.User)
            .OrderByDescending(s => s.DateSubscribed)
            .Take(10)
            .ToListAsync(cancellationToken);

        var recentSubscribers = recentSubscribersRaw
            .Select(s => new ChannelSubscriberItemModel
            {
                NickName = s.User?.UserName,
                AvatarImage = s.User?.Image,
                Name = $"{s.User?.FirstName} {s.User?.LastName}".Trim(),
                DateSubscribed = s.DateSubscribed.ToString("yyyy-MM-dd")
            })
            .ToList();

        var mostPopularVideo = await videoMapper.ProjectToItemModel(
            videoRepo.AsQurable()
                .Where(v => v.ChannelId == targetChannelId && !v.IsDeleted)
                .OrderByDescending(v => v.ViewCount)
        ).FirstOrDefaultAsync(cancellationToken);

        return new ChannelStatisticsModel
        {
            Overview          = overview,
            RecentSubscribers = recentSubscribers,
            MostPopularVideo  = mostPopularVideo
        };
    }
}
