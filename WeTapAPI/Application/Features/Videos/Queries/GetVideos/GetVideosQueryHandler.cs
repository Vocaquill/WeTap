using Application.Constants;
using Application.Interfaces;
using Application.Mappings;
using Application.Models.Video;
using Domain.Entities.Video;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Videos.Queries.GetVideos;

public class GetVideosQueryHandler(
    IGenericRepository<VideoEntity, long> repo,
    VideoMappingProfile mapper,
    ICurrentUserService currentUser)
    : IRequestHandler<GetVideosQuery, IEnumerable<VideoItemModel>>
{
    public async Task<IEnumerable<VideoItemModel>> Handle(GetVideosQuery request, CancellationToken cancellationToken)
    {
        IQueryable<VideoEntity> query = repo.AsQurable()
            .Where(x => !x.IsDeleted && x.Video != "processing...");

        return await mapper.ProjectToItemModel(query.ForCurrentUser(currentUser))
            .ToListAsync(cancellationToken);
    }
}
