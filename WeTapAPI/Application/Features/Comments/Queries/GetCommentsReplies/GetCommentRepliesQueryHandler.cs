using Application.Models.Comments;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Comments.Queries.GetCommentsReplies;

public class GetCommentRepliesQueryHandler(AppDbContext context, IMapper mapper)
    : IRequestHandler<GetCommentRepliesQuery, List<CommentsItemModal>>
{
    public async Task<List<CommentsItemModal>> Handle(
        GetCommentRepliesQuery request,
        CancellationToken cancellationToken
    )
    {
        return await context
            .Comments.AsNoTracking()
            .Where(x => x.ParentId == request.ParentId && !x.IsDeleted)
            .OrderBy(x => x.DateCreated)
            .ProjectTo<CommentsItemModal>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
