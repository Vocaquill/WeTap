using Application.Models.Search;
using Application.Models.Tag;
using MediatR;

namespace Application.Features.Tags.Queries.SearchTags;

public record SearchTagsQuery(TagSearchModel Model) : IRequest<SearchResult<TagItemModel>>;
