using Application.Interfaces;
using Application.Models.Video;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities.Video;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Videos.Queries.GetVideos;

public class GetVideosQueryHandler(IGenericRepository<VideoEntity, long> repo, IMapper mapper)
    : IRequestHandler<GetVideosQuery, IEnumerable<VideoItemModel>>
{
    public async Task<IEnumerable<VideoItemModel>> Handle(GetVideosQuery request, CancellationToken cancellationToken)
    {
        return await repo.AsQurable()
            .ProjectTo<VideoItemModel>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
