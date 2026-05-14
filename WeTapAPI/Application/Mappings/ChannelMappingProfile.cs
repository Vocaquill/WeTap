using Application.Models.Channel;
using AutoMapper;
using Domain.Entities.Channel;

namespace Application.Mappings;

public class ChannelMappingProfile : Profile
{
    public ChannelMappingProfile()
    {
        CreateMap<ChannelEntity, ChannelItemModel>()
            .ForMember(dest => dest.SubscriberCount, opt => opt.MapFrom(x => x.Subscribers!.Count(x => x.User!.IsDeleted == false)));

        CreateMap<ChannelCreateModel, ChannelEntity>()
            .ForMember(dest => dest.AvatarImage, opt => opt.Ignore())
            .ForMember(dest => dest.BannerImage, opt => opt.Ignore());

        CreateMap<ChannelUpdateModel, ChannelEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.AvatarImage, opt => opt.Ignore())
            .ForMember(dest => dest.BannerImage, opt => opt.Ignore());
    }
}
