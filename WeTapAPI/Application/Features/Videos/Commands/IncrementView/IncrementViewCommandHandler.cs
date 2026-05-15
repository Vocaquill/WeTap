using Application.Interfaces;
using Domain.Entities.Video;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Videos.Commands.IncrementView;

public class IncrementViewCommandHandler(IGenericRepository<VideoEntity, long> repo)
    : IRequestHandler<IncrementViewCommand>
{
    public async Task Handle(IncrementViewCommand request, CancellationToken cancellationToken)
    {
        await repo.AsQurable()
            .Where(x => x.Id == request.Id)
            .ExecuteUpdateAsync(s => s.SetProperty(b => b.ViewCount, b => b.ViewCount + 1), cancellationToken);
    }
}
