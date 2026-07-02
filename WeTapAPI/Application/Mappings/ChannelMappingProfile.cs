using Application.Models.Channel;
using Application.Models.Statistics;
using Domain.Entities.Channel;
using Riok.Mapperly.Abstractions;

namespace Application.Mappings;

[Mapper]
public partial class ChannelMappingProfile
{
    [MapProperty(nameof(ChannelEntity.Subscribers), nameof(ChannelItemModel.SubscriberCount))]
    public partial ChannelItemModel MapToItemModel(ChannelEntity entity);

    private static int MapSubscribersToCount(ICollection<ChannelSubscriberEntity>? subscribers)
        => subscribers?.Count(x => x.User!.IsDeleted == false) ?? 0;

    [MapperIgnoreTarget(nameof(ChannelEntity.AvatarImage))]
    [MapperIgnoreTarget(nameof(ChannelEntity.BannerImage))]
    public partial ChannelEntity MapToEntity(ChannelCreateModel model);

    [MapperIgnoreTarget(nameof(ChannelEntity.Id))]
    [MapperIgnoreTarget(nameof(ChannelEntity.AvatarImage))]
    [MapperIgnoreTarget(nameof(ChannelEntity.BannerImage))]
    public partial void MapToEntity(ChannelUpdateModel model, ChannelEntity entity);
    
    [MapProperty(nameof(ChannelEntity.Subscribers), nameof(ChannelItemModel.SubscriberCount))]
    public partial IQueryable<ChannelItemModel> ProjectToItemModel(IQueryable<ChannelEntity> query);

    [MapProperty(nameof(ChannelSubscriberEntity.User.UserName), nameof(ChannelSubscriberItemModel.NickName))]
    [MapProperty(nameof(ChannelSubscriberEntity.User.Image), nameof(ChannelSubscriberItemModel.AvatarImage))]
    public partial ChannelSubscriberItemModel MapToSubscriberItemModel(ChannelSubscriberEntity entity);

    private void AfterMapToSubscriberItemModel(ChannelSubscriberEntity entity, ChannelSubscriberItemModel model)
    {
        model.Name = $"{entity.User?.FirstName} {entity.User?.LastName}".Trim();
        model.DateSubscribed = entity.DateSubscribed.ToString("yyyy-MM-dd");
    }
}
