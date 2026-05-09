using Application.Interfaces;
using Domain.Entities.Channel;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Channel.Commands.DeleteChannel;

public class DeleteChannelHandler(IGenericRepository<ChannelEntity, long> repo, ICurrentUserService currentUserService)
    : IRequestHandler<DeleteChannelCommand>
{
    public async Task Handle(DeleteChannelCommand request, CancellationToken cancellationToken)
    {
        long id = currentUserService.GetCurrentUserId();
        var channel = await repo.GetByIdAsync(id);

        await repo.DeleteAsync(channel.Id);
    }
}
