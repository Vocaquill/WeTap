using Application.Interfaces;
using Application.Models.Channel;
using AutoMapper;
using Domain.Entities.Channel;
using MediatR;

namespace Application.Features.Channel.Commands.CreateChannel;

public class CreateChannelHandler(
    IGenericRepository<ChannelEntity, long> repo,
    IMapper mapper,
    IImageService imageService
) : IRequestHandler<CreateChannelCommand, ChannelItemModel>
{
    public async Task<ChannelItemModel> Handle(CreateChannelCommand request, CancellationToken cancellationToken)
    {
        var entity = mapper.Map<ChannelEntity>(request.Model);
        entity.Id = 1; // тут буде в майбутньому юзерід з токена

        if (request.Model.AvatarImage != null)
        {
            entity.AvatarImage = await imageService.SaveImageAsync(request.Model.AvatarImage);
        }

        if (request.Model.BannerImage != null)
        {
            entity.BannerImage = await imageService.SaveImageAsync(request.Model.BannerImage);
        }

        await repo.AddAsync(entity);
        await repo.SaveChangesAsync();

        return mapper.Map<ChannelItemModel>(entity);
    }
}
