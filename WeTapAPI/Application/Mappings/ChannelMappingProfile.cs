using Application.Models.Channel;
using AutoMapper;
using Domain.Entities.Channel;

namespace Application.Mappings;

public class ChannelMappingProfile : Profile
{
    public ChannelMappingProfile()
    {
        CreateMap<ChannelEntity, ChannelItemModel>();

        CreateMap<ChannelCreateModel, ChannelEntity>()
            .ForMember(dest => dest.AvatarImage, opt => opt.Ignore())
            .ForMember(dest => dest.BannerImage, opt => opt.Ignore());
    }
}
