using Application.Models.Tag;
using MediatR;

namespace Application.Features.Tags.Commands.CreateTag;

public record CreateTagCommand(TagCreateModel Model)
    : IRequest<TagItemModel>;