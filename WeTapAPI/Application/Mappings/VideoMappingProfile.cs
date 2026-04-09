using Application.Models.Video;
using AutoMapper;
using Domain.Entities.Video;

namespace Application.Mappings;

public class VideoMappingProfile : Profile
{
    public VideoMappingProfile()
    {
        CreateMap<VideoEntity, VideoItemModel>()
            .ForMember(x => x.Genres,
                opt => opt.MapFrom(x =>
                    x.VideoGenres.Select(mg => mg.Genre)));

        CreateMap<VideoSeedModel, VideoEntity>()
            .ForMember(dest => dest.Image, opt => opt.Ignore())
            .ForMember(dest => dest.Video, opt => opt.Ignore())
            .ForMember(dest => dest.VideoGenres, opt => opt.Ignore());

        CreateMap<VideoCreateModel, VideoEntity>()
            .ForMember(dest => dest.Image, opt => opt.Ignore())
            .ForMember(dest => dest.Video, opt => opt.Ignore())
            .ForMember(dest => dest.VideoGenres, opt => opt.Ignore());

        CreateMap<VideoUpdateModel, VideoEntity>()
            .ForMember(dest => dest.Image, opt => opt.Ignore())
            .ForMember(dest => dest.Video, opt => opt.Ignore())
            .ForMember(dest => dest.VideoGenres, opt => opt.Ignore());
    }
}
