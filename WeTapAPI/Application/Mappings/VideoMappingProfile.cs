using Application.Models.Video;
using Domain.Entities.Video;
using Riok.Mapperly.Abstractions;
using System.Globalization;

namespace Application.Mappings;

[Mapper]
public partial class VideoMappingProfile
{
    private readonly ChannelMappingProfile _channelMapper = new();
    private readonly GenreMappingProfile _genreMapper = new();
    private readonly TagMappingProfile _tagMapper = new();

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

    public IQueryable<VideoItemModel> ProjectToItemModel(IQueryable<VideoEntity> query)
    {
        var ukraineCulture = new CultureInfo("uk-UA");
        return query.Select(x => new VideoItemModel
        {
            Id = x.Id,
            Title = x.Title,
            Slug = x.Slug,
            Description = x.Description,
            Video = x.Video,
            Image = x.Image,
            ViewCount = x.ViewCount,
            DateCreated = x.DateCreated.ToString("d MMM yyyy'р.'", ukraineCulture),
            Channel = new Application.Models.Channel.ChannelItemModel
            {
                Id = x.Channel.Id,
                Name = x.Channel.Name,
                NickName = x.Channel.NickName,
                Description = x.Channel.Description,
                AvatarImage = x.Channel.AvatarImage,
                BannerImage = x.Channel.BannerImage,
                SubscriberCount = x.Channel.Subscribers.Count(s => !s.User.IsDeleted)
            },
            Privacy = new VideoPrivacyItemModel
            {
                Id = x.Privacy.Id,
                Name = x.Privacy.Name
            },
            LikesCount = x.VideoReactions.Count(r => r.IsLike),
            DislikesCount = x.VideoReactions.Count(r => !r.IsLike),
            Genres = x.VideoGenres.Select(mg => new Application.Models.Genre.GenreItemModel
            {
                Id = mg.Genre.Id,
                Name = mg.Genre.Name,
                Slug = mg.Genre.Slug,
                Image = mg.Genre.Image
            }).ToList(),
            Tags = x.VideoTags.Select(mt => new Application.Models.Tag.TagItemModel
            {
                Id = mt.Tag.Id,
                Name = mt.Tag.Name
            }).ToList()
        });
    }
}
