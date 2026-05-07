using Application.Models.Comments;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Comments.Queries.GetVideoComments;

public class GetVideoCommentsQueryHandler(AppDbContext context, IMapper mapper)
    : IRequestHandler<GetVideoCommentsQuery, List<CommentsItemModal>>
{
    public async Task<List<CommentsItemModal>> Handle(
        GetVideoCommentsQuery request,
        CancellationToken cancellationToken
    )
    {
        return await context
            .Comments.AsNoTracking()
            .Where(x => x.VideoId == request.VideoId && x.ParentId == null && !x.IsDeleted)
            .OrderByDescending(x => x.DateCreated)
            .ProjectTo<CommentsItemModal>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
