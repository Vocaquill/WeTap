using Application.Models.Video;
using AutoMapper;
using Domain.Entities.Video;
using System.Globalization;

namespace Application.Mappings;

public class VideoMappingProfile : Profile
{
    public VideoMappingProfile()
    {
        var ukraineCulture = new CultureInfo("uk-UA");

        CreateMap<VideoEntity, VideoItemModel>()
            .ForMember(x => x.Genres,
                opt => opt.MapFrom(x =>
                    x.VideoGenres.Select(mg => mg.Genre)))
            .ForMember(x => x.Tags,
                opt => opt.MapFrom(x =>
                    x.VideoTags.Select(mt => mt.Tag)))
            .ForMember(x => x.Channel, opt => opt.MapFrom(src => src.Channel))
            .ForMember(dest => dest.DateCreated,
                opt => opt.MapFrom(src =>
                    src.DateCreated.ToString("d MMMM yyyy'р.' 'о' HH:mm", ukraineCulture)))
            .ForMember(x => x.LikesCount,
                opt => opt.MapFrom(x => x.VideoReactions.Count(r => r.IsLike)))
            .ForMember(x => x.DislikesCount,
                opt => opt.MapFrom(x => x.VideoReactions.Count(r => !r.IsLike)));

        CreateMap<VideoPrivacyEntity, VideoPrivacyItemModel>();

        CreateMap<VideoSeedModel, VideoEntity>()
            .ForMember(dest => dest.Image, opt => opt.Ignore())
            .ForMember(dest => dest.Video, opt => opt.Ignore())
            .ForMember(dest => dest.VideoGenres, opt => opt.Ignore());

        CreateMap<VideoCreateModel, VideoEntity>()
            .ForMember(dest => dest.Image, opt => opt.Ignore())
            .ForMember(dest => dest.Video, opt => opt.Ignore())
            .ForMember(dest => dest.VideoGenres, opt => opt.Ignore())
            .ForMember(dest => dest.VideoTags, opt => opt.Ignore());

        CreateMap<VideoUpdateModel, VideoEntity>()
            .ForMember(dest => dest.Image, opt => opt.Ignore())
            .ForMember(dest => dest.Video, opt => opt.Ignore())
            .ForMember(dest => dest.VideoGenres, opt => opt.Ignore())
            .ForMember(dest => dest.VideoTags, opt => opt.Ignore());

        CreateMap<VideoReactionModel, VideoReactionEntity>();
    }
}
