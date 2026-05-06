using Application.Interfaces;
using Domain.Entities.Channel;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Channel.Commands.DeleteChannel;

public class DeleteChannelHandler(IGenericRepository<ChannelEntity, long> repo)
    : IRequestHandler<DeleteChannelCommand>
{
    public async Task Handle(DeleteChannelCommand request, CancellationToken cancellationToken)
    {
        var channel = await repo.GetByIdAsync(request.Model.Id);

        await repo.DeleteAsync(channel.Id);
    }
}
