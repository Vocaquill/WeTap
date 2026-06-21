using Application.Interfaces;
using Application.Mappings;
using Application.Models.Channel;
using Domain.Entities.Channel;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Application.Features.Channel.Queries.GetChannelById;

public class GetChannelByIdQueryHandler(
    IGenericRepository<ChannelEntity, long> repo,
    ChannelMappingProfile channelMapper)
    : IRequestHandler<GetChannelByIdQuery, ChannelItemModel>
{
    public async Task<ChannelItemModel> Handle(GetChannelByIdQuery request, CancellationToken cancellationToken)
    {
        var query = repo.AsQurable().AsNoTracking();

        var channel = await channelMapper.ProjectToItemModel(query)
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (channel == null)
            throw new KeyNotFoundException($"Канал з ID {request.Id} не знайдено.");

        return channel;
    }
}