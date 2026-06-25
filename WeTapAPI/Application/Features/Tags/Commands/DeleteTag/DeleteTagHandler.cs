using Application.Interfaces;
using Domain.Entities.Tag;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Tags.Commands.DeleteTag;

public class DeleteTagHandler(IGenericRepository<TagEntity, long> repo)
    : IRequestHandler<DeleteTagCommand>
{
    public async Task Handle(
        DeleteTagCommand request,
        CancellationToken cancellationToken)
    {
        var tag = await repo.GetByIdAsync(request.Model.Id);

        await repo.DeleteAsync(tag.Id);
    }
}