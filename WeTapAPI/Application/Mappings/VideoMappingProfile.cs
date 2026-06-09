using Application.Models.Video;
using Application.Models.Genre;
using Application.Models.Tag;
using Domain.Entities.Video;
using Domain.Entities.Genre;
using Domain.Entities.Tag;
using Riok.Mapperly.Abstractions;
using System.Globalization;

namespace Application.Mappings;

[Mapper]
public partial class VideoMappingProfile(
    GenreMappingProfile genreMapper,
    TagMappingProfile tagMapper)
{
    private readonly ChannelMappingProfile _channelMapper = new();
    private readonly GenreMappingProfile _genreMapper = genreMapper;
    private readonly TagMappingProfile _tagMapper = tagMapper;


    [UserMapping(Default = true)]
    [MapProperty(nameof(VideoEntity.Channel), nameof(VideoItemModel.Channel))]
    [MapperIgnoreTarget(nameof(VideoItemModel.DateCreated))]
    [MapperIgnoreTarget(nameof(VideoItemModel.Genres))]
    [MapperIgnoreTarget(nameof(VideoItemModel.Tags))]
    [MapperIgnoreTarget(nameof(VideoItemModel.LikesCount))]
    [MapperIgnoreTarget(nameof(VideoItemModel.DislikesCount))]
    public partial VideoItemModel MapToItemModel(VideoEntity entity);

    public VideoItemModel MapToVideoItemModelCustom(VideoEntity entity)
    {
        var model = MapToItemModel(entity);
        var ukraineCulture = new CultureInfo("uk-UA");
        model.DateCreated = entity.DateCreated.ToString("d MMM yyyy'р.'", ukraineCulture);
        model.LikesCount = entity.VideoReactions.Count(r => r.IsLike);
        model.DislikesCount = entity.VideoReactions.Count(r => !r.IsLike);
        model.Genres = entity.VideoGenres.Select(mg => _genreMapper.MapToItemModel(mg.Genre)).ToList();
        model.Tags = entity.VideoTags.Select(mt => _tagMapper.MapToItemModel(mt.Tag)).ToList();
        return model;
    }

    public partial VideoPrivacyItemModel MapToItemModel(VideoPrivacyEntity entity);

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

    public partial IQueryable<VideoPrivacyItemModel> ProjectToItemModel(IQueryable<VideoPrivacyEntity> query);

    [MapProperty(nameof(VideoEntity.VideoReactions), nameof(VideoItemModel.LikesCount))]
    [MapProperty(nameof(VideoEntity.VideoReactions), nameof(VideoItemModel.DislikesCount))]
    [MapProperty(nameof(VideoEntity.VideoGenres), nameof(VideoItemModel.Genres))]
    [MapProperty(nameof(VideoEntity.VideoTags), nameof(VideoItemModel.Tags))]
    public partial IQueryable<VideoItemModel> ProjectToItemModel(IQueryable<VideoEntity> query);

    private static int MapLikesCount(ICollection<VideoReactionEntity> reactions)
        => reactions.Count(r => r.IsLike);

    private static int MapDislikesCount(ICollection<VideoReactionEntity> reactions)
        => reactions.Count(r => !r.IsLike);

    private static string MapDateCreated(DateTime dateCreated)
        => dateCreated.ToString("d MMM yyyy'р.'", new CultureInfo("uk-UA"));

    [MapProperty($"{nameof(VideoGenreEntity.Genre)}.{nameof(GenreEntity.Id)}", nameof(GenreItemModel.Id))]
    [MapProperty($"{nameof(VideoGenreEntity.Genre)}.{nameof(GenreEntity.Name)}", nameof(GenreItemModel.Name))]
    [MapProperty($"{nameof(VideoGenreEntity.Genre)}.{nameof(GenreEntity.Slug)}", nameof(GenreItemModel.Slug))]
    [MapProperty($"{nameof(VideoGenreEntity.Genre)}.{nameof(GenreEntity.Image)}", nameof(GenreItemModel.Image))]
    private partial GenreItemModel MapGenre(VideoGenreEntity videoGenre);

    [MapProperty($"{nameof(VideoTagEntity.Tag)}.{nameof(TagEntity.Id)}", nameof(TagItemModel.Id))]
    [MapProperty($"{nameof(VideoTagEntity.Tag)}.{nameof(TagEntity.Name)}", nameof(TagItemModel.Name))]
    [MapProperty($"{nameof(VideoTagEntity.Tag)}.{nameof(TagEntity.Slug)}", nameof(TagItemModel.Slug))]
    private partial TagItemModel MapTag(VideoTagEntity videoTag);
}
