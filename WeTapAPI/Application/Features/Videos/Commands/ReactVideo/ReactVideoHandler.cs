using Application.Interfaces;
using Application.Models.Video;
using AutoMapper;
using Domain;
using Domain.Entities.Video;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Videos.Commands.ReactVideo;

public class ReactVideoHandler(
    AppDbContext context,
    IMapper mapper,
    ICurrentUserService currentUserService)
    : IRequestHandler<ReactVideoCommand>
{
    public async Task Handle(ReactVideoCommand request, CancellationToken cancellationToken)
    {
        var userId = currentUserService.GetCurrentUserId();

        var videoExists = await context.Videos
            .AnyAsync(x => x.Id == request.Model.VideoId && !x.IsDeleted, cancellationToken);

        if (!videoExists)
            throw new Exception("Video not found");

        var reaction = await context.VideoReactions
            .FirstOrDefaultAsync(x =>
                x.VideoId == request.Model.VideoId &&
                x.UserId == userId,
                cancellationToken
            );

        if (reaction == null)
        {
            reaction = mapper.Map<VideoReactionEntity>(request.Model);
            reaction.UserId = userId;

            context.VideoReactions.Add(reaction);
        }
        else
        {
            reaction.IsLike = request.Model.IsLike;
            context.VideoReactions.Update(reaction);
        }

        await context.SaveChangesAsync(cancellationToken);
    }
}
