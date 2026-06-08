using Application.Models.Language;
using Riok.Mapperly.Abstractions;
using Domain.Entities.Language;

namespace Application.Mappings;

[Mapper]
public partial class LanguageMappingProfile
{
    public partial VideoLanguageEntity MapToEntity(LanguageSeedModel model);
    public partial LanguageItemModel MapToItemModel(VideoLanguageEntity entity);
    public partial VideoLanguageEntity MapToEntity(LanguageCreateModel model);
    public partial void MapToEntity(LanguageUpdateModel model, VideoLanguageEntity entity);
    
    public partial IQueryable<LanguageItemModel> ProjectToItemModel(IQueryable<VideoLanguageEntity> query);
}
