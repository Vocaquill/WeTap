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
        ChannelEntity channel;

        try
        {
            channel = await repo.AsQurable().Where(x => x.Id == request.Model.Id && !x.IsDeleted).FirstAsync(cancellationToken);
            if (channel == null)
                throw new Exception();
        }
        catch (Exception)
        {
            throw new Exception("Канал не знайдено");
        }

        await repo.DeleteAsync(channel.Id);
    }
}
