using Application.Models.Video;
using Application.Models.Genre;
using Application.Models.Tag;
using Domain.Entities.Video;
using Domain.Entities.Genre;
using Domain.Entities.Tag;
using Riok.Mapperly.Abstractions;

namespace Application.Mappings;

[Mapper]
[UseStaticMapper(typeof(GenreMappingProfile))]
[UseStaticMapper(typeof(TagMappingProfile))]
public partial class VideoMappingProfile
{
    [MapProperty(nameof(VideoEntity.Channel), nameof(VideoItemModel.Channel))]
    [MapProperty(nameof(VideoEntity.VideoGenres), nameof(VideoItemModel.Genres))]
    [MapProperty(nameof(VideoEntity.VideoTags), nameof(VideoItemModel.Tags))]
    public partial VideoItemModel MapToItemModel(VideoEntity entity);

    [MapProperty(nameof(VideoEntity.VideoGenres), nameof(VideoItemModel.Genres))]
    [MapProperty(nameof(VideoEntity.VideoTags), nameof(VideoItemModel.Tags))]
    public partial IQueryable<VideoItemModel> ProjectToItemModel(IQueryable<VideoEntity> query);

    public partial VideoPrivacyItemModel MapToItemModel(VideoPrivacyEntity entity);
    public partial IQueryable<VideoPrivacyItemModel> ProjectToItemModel(IQueryable<VideoPrivacyEntity> query);

    protected partial GenreItemModel MapVideoGenreToGenreModel(VideoGenreEntity videoGenre);
    protected partial TagItemModel MapVideoTagToTagModel(VideoTagEntity videoTag);

    [MapperIgnoreTarget(nameof(VideoEntity.Image))]
    [MapperIgnoreTarget(nameof(VideoEntity.Video))]
    [MapperIgnoreTarget(nameof(VideoEntity.VideoGenres))]
    public partial VideoEntity MapToEntity(VideoSeedModel model);

    [MapperIgnoreTarget(nameof(VideoEntity.Image))]
    [MapperIgnoreTarget(nameof(VideoEntity.Video))]
    [MapperIgnoreTarget(nameof(VideoEntity.VideoGenres))]
    [MapperIgnoreTarget(nameof(VideoEntity.VideoTags))]
    public partial VideoEntity MapToEntity(VideoCreateModel model);

    [MapperIgnoreTarget(nameof(VideoEntity.Image))]
    [MapperIgnoreTarget(nameof(VideoEntity.Video))]
    [MapperIgnoreTarget(nameof(VideoEntity.VideoGenres))]
    [MapperIgnoreTarget(nameof(VideoEntity.VideoTags))]
    [MapperIgnoreTarget(nameof(VideoEntity.ChannelId))]
    public partial void MapToEntity(VideoUpdateModel model, VideoEntity entity);

    public partial VideoReactionEntity MapToEntity(VideoReactionModel model);

    protected static string MapDateCreated(DateTime dateCreated)
        => dateCreated.ToString("dd.MM.yyyy'р.'");

    protected static int MapLikesCount(ICollection<VideoReactionEntity> reactions)
        => reactions.Count(r => r.IsLike);

    protected static int MapDislikesCount(ICollection<VideoReactionEntity> reactions)
        => reactions.Count(r => !r.IsLike);
}