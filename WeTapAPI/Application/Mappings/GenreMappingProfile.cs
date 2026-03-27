using Application.Models.Genre;
using AutoMapper;
using Domain.Entities;

namespace Application.Mappings;

public class GenreMappingProfile : Profile
{
    public GenreMappingProfile()
    {
        CreateMap<GenreEntity, GenreItemModel>();
    }
}
