using Application.Constants;
using Application.Interfaces;
using Application.Models.Comments;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Comments.Queries.GetVideoComments;

public class GetVideoCommentsQueryHandler(
    AppDbContext context,
    IMapper mapper,
    ICurrentUserService currentUser)
    : IRequestHandler<GetVideoCommentsQuery, List<CommentsItemModal>>
{
    public async Task<List<CommentsItemModal>> Handle(
        GetVideoCommentsQuery request,
        CancellationToken cancellationToken
    )
    {
        var videoExists = await context.Videos
            .Where(x => x.Id == request.VideoId && !x.IsDeleted)
            .ForCurrentUser(currentUser)
            .AnyAsync(cancellationToken);

        if (!videoExists)
            throw new Exception("Відео не знайдено");

        return await context
            .Comments.AsNoTracking()
            .Where(x => x.VideoId == request.VideoId && x.ParentId == null && !x.IsDeleted)
            .OrderByDescending(x => x.DateCreated)
            .ProjectTo<CommentsItemModal>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
