using Application.Constants;
using Application.Features.Videos.Queries.GetVideos;
using Application.Interfaces;
using Application.Mappings;
using Application.Models.Video;
using Domain;
using Domain.Entities.Video;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Videos.Queries.GetByVideo;

public class GetByVideoQueryHandler(
    IGenericRepository<VideoEntity, long> repo,
    VideoMappingProfile mapper,
    ICurrentUserService currentUser,
    AppDbContext context)
    : IRequestHandler<GetByVideoQuery, VideoItemModel>
{
    public async Task<VideoItemModel> Handle(GetByVideoQuery request, CancellationToken cancellationToken)
    {
        IQueryable<VideoEntity> query = repo.AsQurable().Where(x => !x.IsDeleted);

        if (request.Model.Id != null)
        {
            query = query.Where(x => x.Id == request.Model.Id.Value);
        }
        else if (!string.IsNullOrEmpty(request.Model.Slug))
        {
            query = query.Where(x => x.Slug == request.Model.Slug);
        }
        else
        {
            throw new Exception("Необхідно вказати Id або Slug");
        }

        query = query.ForDirectAccess(currentUser);

        var model = await mapper.ProjectToItemModel(query)
            .FirstOrDefaultAsync(cancellationToken);

        if (model == null)
            throw new Exception("Відео не знайдено");

        model.LikesCount = await context.VideoReactions
            .CountAsync(x => x.VideoId == model.Id && x.IsLike, cancellationToken);
        model.DislikesCount = await context.VideoReactions
            .CountAsync(x => x.VideoId == model.Id && !x.IsLike, cancellationToken);

        if (model.Channel != null)
        {
            model.Channel.SubscriberCount = await context.ChannelSubscribers
                .CountAsync(x => x.ChannelId == model.Channel.Id, cancellationToken);
        }
        
        var userId = currentUser.TryGetCurrentUserId();
        if (userId.HasValue)
        {
            var userReaction = await context.VideoReactions
                .FirstOrDefaultAsync(x => x.VideoId == model.Id && x.UserId == userId.Value, cancellationToken);
            model.IsLiked = userReaction?.IsLike;

            if (model.Channel != null)
            {
                model.Channel.IsSubscribed = await context.ChannelSubscribers
                    .AnyAsync(x => x.ChannelId == model.Channel.Id && x.UserId == userId.Value, cancellationToken);
            }
        }

        return model;
    }
}