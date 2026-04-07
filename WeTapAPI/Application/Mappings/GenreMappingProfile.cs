using Application.Models.Genre;
using AutoMapper;
using Domain.Entities.Genre;

namespace Application.Mappings;

public class GenreMappingProfile : Profile
{
    public GenreMappingProfile()
    {
        CreateMap<GenreEntity, GenreItemModel>();
        CreateMap<GenreSeedModel, GenreEntity>();
        CreateMap<GenreUpdateModel, GenreEntity>()
            .ForMember(x => x.Image, opt => opt.Ignore());
        CreateMap<GenreCreateModel, GenreEntity>()
            .ForMember(x => x.Image, opt => opt.Ignore());
    }
}
