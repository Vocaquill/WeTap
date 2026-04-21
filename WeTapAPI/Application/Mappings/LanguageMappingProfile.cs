using Application.Models.Language;
using AutoMapper;
using Domain.Entities.Language;

namespace Application.Mappings;

public class LanguageMappingProfile : Profile
{
    public LanguageMappingProfile()
    {
        CreateMap<LanguageSeedModel, VideoLanguageEntity>();
    }
}
