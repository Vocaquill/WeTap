using Application.Models.Genre;
using Riok.Mapperly.Abstractions;
using Domain.Entities.Genre;

namespace Application.Mappings;

[Mapper]
public partial class GenreMappingProfile
{
    public partial GenreItemModel MapToItemModel(GenreEntity entity);
    
    public partial GenreEntity MapToEntity(GenreSeedModel model);
    
    [MapperIgnoreTarget(nameof(GenreEntity.Image))]
    public partial void MapToEntity(GenreUpdateModel model, GenreEntity entity);
    
    [MapperIgnoreTarget(nameof(GenreEntity.Image))]
    public partial GenreEntity MapToEntity(GenreCreateModel model);
    
    [MapperIgnoreSource(nameof(GenreEntity.VideoGenres))]
    [MapperIgnoreSource(nameof(GenreEntity.IsDeleted))]
    [MapperIgnoreSource(nameof(GenreEntity.DateCreated))]
    public partial IQueryable<GenreItemModel> ProjectToItemModel(IQueryable<GenreEntity> query);
}
