using Application.Models.Tag;
using Application.Models.Search;
using MediatR;

namespace Application.Features.Tags.Queries.GetByTag;

public record GetByTagQuery(GetByModel Model)
    : IRequest<TagItemModel?>;
