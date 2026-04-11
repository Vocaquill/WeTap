using Application.Interfaces;
using Application.Models.Tag;
using AutoMapper;
using Domain.Entities.Tag;
using MediatR;

namespace Application.Features.Tags.Queries.GetTags;

public class GetTagsQueryHandler(IGenericRepository<TagEntity, long> repo, IMapper mapper)
    : IRequestHandler<GetTagsQuery, IEnumerable<TagItemModel>>
{
    public async Task<IEnumerable<TagItemModel>> Handle(GetTagsQuery request, CancellationToken cancellationToken)
    {
        var tags = await repo.ListAllAsync();
        return mapper.Map<IEnumerable<TagItemModel>>(tags);
    }
}