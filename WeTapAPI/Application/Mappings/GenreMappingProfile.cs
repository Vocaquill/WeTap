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
    }
}
