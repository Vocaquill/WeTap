using Application.Constants;
using Application.Interfaces;
using Application.Models.Channel;
using Application.Mappings;
using Domain.Entities.Channel;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Channel.Commands.UpdateChannel;

public class ChannelUpdateHandler(
    IGenericRepository<ChannelEntity, long> repo,
    ChannelMappingProfile channelMapper,
    IImageService imageService,
    ICurrentUserService currentUserService
    ) : IRequestHandler<UpdateChannelCommand, ChannelItemModel>
{
    public async Task<ChannelItemModel> Handle(UpdateChannelCommand request, CancellationToken cancellationToken)
    {
        long userId = currentUserService.GetCurrentUserId();
        
        var entity = await repo.AsQurable()
            .Include(x => x.Author)
            .FirstOrDefaultAsync(x => x.Id == request.Model.Id, cancellationToken);

        if (entity == null)
            throw new Exception("Канал не знайдено");

        if (entity.Author?.Id != userId && !currentUserService.IsInRole(Roles.Admin))
            throw new Exception("Ви не маєте прав на редагування цього каналу");

        channelMapper.MapToEntity(request.Model, entity);

        if (request.Model.AvatarImage != null)
        {
            if (entity.AvatarImage != null)
                await imageService.DeleteImageAsync(entity.AvatarImage);

            var avatarUrl = await imageService.SaveImageAsync(request.Model.AvatarImage);
            entity.AvatarImage = avatarUrl;
        }

        if (request.Model.BannerImage != null)
        {
            if (entity.BannerImage != null)
                await imageService.DeleteImageAsync(entity.BannerImage);

            var bannerUrl = await imageService.SaveImageAsync(request.Model.BannerImage);
            entity.BannerImage = bannerUrl;
        }

        await repo.UpdateAsync(entity);

        return channelMapper.MapToItemModel(entity);
    }
}