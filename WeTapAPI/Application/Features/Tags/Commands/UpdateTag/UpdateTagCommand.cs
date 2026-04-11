using Application.Models.Tag;
using MediatR;

namespace Application.Features.Tags.Commands.UpdateTag;

public record UpdateTagCommand(TagUpdateModel Model)
    : IRequest<TagItemModel>;