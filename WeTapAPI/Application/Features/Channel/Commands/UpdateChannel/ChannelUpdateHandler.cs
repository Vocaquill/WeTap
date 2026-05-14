using Application.Interfaces;
using Application.Models.Channel;
using AutoMapper;
using Domain.Entities.Channel;
using MediatR;

namespace Application.Features.Channel.Commands.UpdateChannel;

public class ChannelUpdateHandler(IGenericRepository<ChannelEntity, long> repo,
    IMapper mapper,
    IImageService imageService,
    ICurrentUserService currentUserService
    ) : IRequestHandler<UpdateChannelCommand, ChannelItemModel>
{
    public async Task<ChannelItemModel> Handle(UpdateChannelCommand request, CancellationToken cancellationToken)
    {
        long id = currentUserService.GetCurrentUserId();
        var entity = await repo.GetByIdAsync(id);

        mapper.Map(request.Model, entity);

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

        return mapper.Map<ChannelItemModel>(entity);
    }
}
