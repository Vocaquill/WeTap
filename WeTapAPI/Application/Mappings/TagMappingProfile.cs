using Application.Models.Tag;
using Riok.Mapperly.Abstractions;
using Domain.Entities.Tag;

namespace Application.Mappings;

[Mapper]
public partial class TagMappingProfile
{
    public partial TagItemModel MapToItemModel(TagEntity entity);
    public partial TagEntity MapToEntity(TagCreateModel model);
    public partial void MapToEntity(TagUpdateModel model, TagEntity entity);
    public partial TagEntity MapToEntity(TagSeedModel model);
    
    [MapperIgnoreSource(nameof(TagEntity.VideoTags))]
    [MapperIgnoreSource(nameof(TagEntity.IsDeleted))]
    [MapperIgnoreSource(nameof(TagEntity.DateCreated))]
    public partial IQueryable<TagItemModel> ProjectToItemModel(IQueryable<TagEntity> query);
}