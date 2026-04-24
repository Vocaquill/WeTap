using Application.Interfaces;
using Application.Models.Tag;
using AutoMapper;
using Domain.Entities.Tag;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Tags.Queries.GetByTag;

public class GetByTagHandler(
    IGenericRepository<TagEntity, long> repo,
    IMapper mapper
) : IRequestHandler<GetByTagQuery, TagItemModel?>
{
    public async Task<TagItemModel?> Handle(GetByTagQuery request, CancellationToken cancellationToken)
    {
        var query = repo.AsQurable()
            .AsNoTracking()
            .Where(x => !x.IsDeleted);

        TagEntity? entity = null;

        if (request.Model.Id.HasValue)
        {
            entity = await query.FirstOrDefaultAsync(x => x.Id == request.Model.Id, cancellationToken);
        }
        else if (!string.IsNullOrWhiteSpace(request.Model.Slug))
        {
            entity = await query.FirstOrDefaultAsync(x => x.Slug == request.Model.Slug, cancellationToken);
        }

        if (entity == null)
            throw new KeyNotFoundException("Tag not found");

        return entity == null ? null : mapper.Map<TagItemModel>(entity);
    }
}
