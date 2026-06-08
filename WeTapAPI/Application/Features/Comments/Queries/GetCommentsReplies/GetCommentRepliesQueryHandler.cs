using Application.Mappings;
using Application.Models.Comments;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Comments.Queries.GetCommentsReplies;

public class GetCommentRepliesQueryHandler(AppDbContext context, CommentMappingProfile mapper)
    : IRequestHandler<GetCommentRepliesQuery, List<CommentsItemModal>>
{
    public async Task<List<CommentsItemModal>> Handle(
        GetCommentRepliesQuery request,
        CancellationToken cancellationToken
    )
    {
        return await mapper.ProjectToItemModel(
            context.Comments.AsNoTracking()
                .Where(x => x.ParentId == request.ParentId && !x.IsDeleted)
                .OrderBy(x => x.DateCreated))
            .ToListAsync(cancellationToken);
    }
}
