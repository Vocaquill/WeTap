using Application.Models.Tag;
using AutoMapper;
using Domain.Entities.Tag;

namespace Application.Mappings;

public class TagMappingProfile : Profile
{
    public TagMappingProfile()
    {
        CreateMap<TagEntity, TagItemModel>();
        CreateMap<TagCreateModel, TagEntity>();
        CreateMap<TagUpdateModel, TagEntity>();
        CreateMap<TagSeedModel, TagEntity>();
    }
}