using Application.Models.Tag;
using MediatR;

namespace Application.Features.Tags.Commands.DeleteTag;

public record DeleteTagCommand(TagDeleteModel Model)
    : IRequest;