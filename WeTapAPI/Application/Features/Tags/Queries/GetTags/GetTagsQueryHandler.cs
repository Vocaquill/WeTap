using Application.Interfaces;
using Application.Mappings;
using Application.Models.Tag;
using Domain.Entities.Tag;
using MediatR;

namespace Application.Features.Tags.Queries.GetTags;

public class GetTagsQueryHandler(IGenericRepository<TagEntity, long> repo, TagMappingProfile mapper)
    : IRequestHandler<GetTagsQuery, IEnumerable<TagItemModel>>
{
    public async Task<IEnumerable<TagItemModel>> Handle(GetTagsQuery request, CancellationToken cancellationToken)
    {
        var tags = await repo.ListAllAsync();
        return tags.Select(mapper.MapToItemModel);
    }
}