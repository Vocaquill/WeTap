using Application.Constants;
using Application.Interfaces;
using Application.Models.Video;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities.Video;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Videos.Queries.GetVideos;

public class GetVideosQueryHandler(
    IGenericRepository<VideoEntity, long> repo,
    IMapper mapper,
    ICurrentUserService currentUser)
    : IRequestHandler<GetVideosQuery, IEnumerable<VideoItemModel>>
{
    public async Task<IEnumerable<VideoItemModel>> Handle(GetVideosQuery request, CancellationToken cancellationToken)
    {
        IQueryable<VideoEntity> query = repo.AsQurable()
            .Where(x => !x.IsDeleted && x.Video != "processing...");

        return await query
            .ForCurrentUser(currentUser)
            .ProjectTo<VideoItemModel>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
