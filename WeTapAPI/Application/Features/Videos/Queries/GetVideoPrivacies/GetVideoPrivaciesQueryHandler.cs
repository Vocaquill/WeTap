using Application.Interfaces;
using Application.Models.Video;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities.Video;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Videos.Queries.GetVideoPrivacies;

public class GetVideoPrivaciesQueryHandler(IGenericRepository<VideoPrivacyEntity, long> repo, IMapper mapper)
    : IRequestHandler<GetVideoPrivaciesQuery, IEnumerable<VideoPrivacyItemModel>>
{
    public async Task<IEnumerable<VideoPrivacyItemModel>> Handle(GetVideoPrivaciesQuery request, CancellationToken cancellationToken)
    {
        return await repo.AsQurable()
            .ProjectTo<VideoPrivacyItemModel>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
