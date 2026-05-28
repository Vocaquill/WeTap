using Application.Constants;
using Application.Interfaces;
using Application.Models.Channel;
using AutoMapper;
using Domain.Entities.Channel;
using Domain.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Features.Channel.Commands.CreateChannel;

public class CreateChannelHandler(
    IGenericRepository<ChannelEntity, long> repo,
    IMapper mapper,
    IImageService imageService,
    ICurrentUserService currentUserService,
    UserManager<UserEntity> userManager
) : IRequestHandler<CreateChannelCommand, ChannelItemModel>
{
    public async Task<ChannelItemModel> Handle(CreateChannelCommand request, CancellationToken cancellationToken)
    {
        var entity = mapper.Map<ChannelEntity>(request.Model);
        long userId = currentUserService.GetCurrentUserId();
        entity.Id = userId;

        if(repo.AsQurable().FirstOrDefault(x => x.Id == userId) != null)
        {
            throw new Exception("Канал з таким Id вже існує");
        }

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

        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user != null)
        {
            await userManager.AddToRoleAsync(user, Roles.Author);
        }

        return mapper.Map<ChannelItemModel>(entity);
    }
}
