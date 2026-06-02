using Application.Constants;
using Application.Interfaces;
using Application.Models.Comments;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using Domain.Entities.Comments;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Comments.Commands.CreateComment;

public class CreateCommentCommandHandler(
    AppDbContext context,
    IMapper mapper,
    ICurrentUserService currentUser)
    : IRequestHandler<CreateCommentCommand, CommentsItemModal>
{
    public async Task<CommentsItemModal> Handle(
        CreateCommentCommand request,
        CancellationToken cancellationToken
    )
    {
        var videoExists = await context.Videos
            .Where(x => x.Id == request.VideoId && !x.IsDeleted)
            .ForCurrentUser(currentUser)
            .AnyAsync(cancellationToken);

        if (!videoExists)
            throw new Exception("Відео не знайдено");

        var comment = new CommentsEntity
        {
            Content = request.Content,
            VideoId = request.VideoId,
            ParentId = request.ParentId,
            UserId = currentUser.GetCurrentUserId(),
        };

        if (request.ParentId.HasValue)
        {
            var parent = await context.Comments.FirstOrDefaultAsync(
                x => x.Id == request.ParentId.Value,
                cancellationToken
            );

            if (parent != null)
            {
                parent.RepliesCount++;
            }
        }

        context.Comments.Add(comment);
        await context.SaveChangesAsync(cancellationToken);

        return await context
            .Comments.AsNoTracking()
            .Where(x => x.Id == comment.Id)
            .ProjectTo<CommentsItemModal>(mapper.ConfigurationProvider)
            .FirstAsync(cancellationToken);
    }
}
