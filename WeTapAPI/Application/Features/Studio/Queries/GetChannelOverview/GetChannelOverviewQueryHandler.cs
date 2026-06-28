using Application.Interfaces;
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
    ICurrentUserService currentUserService)
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

        // Recent subscribers (last 10)
        var recentSubscribersRaw = await channelRepo.AsQurable()
            .Where(c => c.Id == targetChannelId)
            .SelectMany(c => c.Subscribers!)
            .OrderByDescending(s => s.DateSubscribed)
            .Take(10)
            .Select(s => new
            {
                s.User!.FirstName,
                s.User.LastName,
                s.User.UserName,
                s.User.Image,
                s.DateSubscribed
            })
            .ToListAsync(cancellationToken);

        var recentSubscribers = recentSubscribersRaw.Select(s => new ChannelSubscriberItemModel
        {
            Name           = $"{s.FirstName} {s.LastName}".Trim(),
            NickName       = s.UserName ?? string.Empty,
            AvatarImage    = s.Image,
            DateSubscribed = s.DateSubscribed.ToString("yyyy-MM-dd")
        }).ToList();

        // Most popular video
        var topVideoRaw = await videoRepo.AsQurable()
            .Where(v => v.ChannelId == targetChannelId && !v.IsDeleted)
            .OrderByDescending(v => v.ViewCount)
            .Select(v => new
            {
                v.Id,
                v.Title,
                v.Slug,
                v.Description,
                v.ViewCount,
                v.Image,
                v.Video,
                v.DateCreated,
                LikesCount    = v.VideoReactions.Count(r => r.IsLike),
                DislikesCount = v.VideoReactions.Count(r => !r.IsLike)
            })
            .FirstOrDefaultAsync(cancellationToken);

        VideoItemModel? mostPopularVideo = null;
        if (topVideoRaw is not null)
        {
            mostPopularVideo = new VideoItemModel
            {
                Id            = topVideoRaw.Id,
                Title         = topVideoRaw.Title,
                Slug          = topVideoRaw.Slug,
                Description   = topVideoRaw.Description,
                ViewCount     = topVideoRaw.ViewCount,
                Image         = topVideoRaw.Image,
                Video         = topVideoRaw.Video,
                DateCreated   = topVideoRaw.DateCreated.ToString("yyyy-MM-dd"),
                LikesCount    = topVideoRaw.LikesCount,
                DislikesCount = topVideoRaw.DislikesCount
            };
        }

        return new ChannelStatisticsModel
        {
            Overview          = overview,
            RecentSubscribers = recentSubscribers,
            MostPopularVideo  = mostPopularVideo
        };
    }
}
