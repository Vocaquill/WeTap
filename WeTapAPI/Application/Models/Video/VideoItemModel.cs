using Application.Models.Genre;
using Application.Models.Tag;
using Application.Models.Language;
using Application.Models.Channel;

namespace Application.Models.Video;

public class VideoItemModel
{
    public long Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public long ViewCount { get; set; }
    public string DateCreated { get; set; } = string.Empty;

    public string? Image { get; set; }
    public string? Video { get; set; }

    public ChannelItemModel? Channel { get; set; }

    public List<GenreItemModel> Genres { get; set; } = new();
    public List<TagItemModel> Tags { get; set; } = new();
    public VideoPrivacyItemModel? Privacy { get; set; }
    public LanguageItemModel? Language { get; set; }
}
