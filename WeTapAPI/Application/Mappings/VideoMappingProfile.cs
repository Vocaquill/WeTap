using Application.Models.Video;
using AutoMapper;
using Domain.Entities.Video;

namespace Application.Mappings;

public class VideoMappingProfile : Profile
{
    public VideoMappingProfile()
    {
        CreateMap<VideoSeedModel, VideoEntity>()
            .ForMember(dest => dest.Image, opt => opt.Ignore())
            .ForMember(dest => dest.Video, opt => opt.Ignore())
            .ForMember(dest => dest.VideoGenres, opt => opt.Ignore());
    }
}
