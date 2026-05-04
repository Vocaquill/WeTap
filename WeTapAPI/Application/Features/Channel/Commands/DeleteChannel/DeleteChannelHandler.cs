using Application.Features.Genres.Commands.DeleteGenre;
using Application.Interfaces;
using Domain.Entities.Channel;
using MediatR;

namespace Application.Features.Channel.Commands.DeleteChannel;

public class DeleteChannelHandler(IGenericRepository<ChannelEntity, long> repo)
    : IRequestHandler<DeleteChannelCommand>
{
    public async Task Handle(DeleteChannelCommand request, CancellationToken cancellationToken)
    {
        var entity = await repo.GetByIdAsync(request.Model.Id);

        entity!.IsDeleted = true;
        await repo.UpdateAsync(entity);
    }
}
