using Application.Models.Tag;
using MediatR;

namespace Application.Features.Tags.Queries.GetTags;

public record GetTagsQuery : IRequest<IEnumerable<TagItemModel>>;