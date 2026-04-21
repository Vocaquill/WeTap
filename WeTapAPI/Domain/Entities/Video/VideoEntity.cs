using Domain.Entities.Language;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Video;

[Table("tbl_videos")]
public class VideoEntity : BaseEntity<long>
{
    [Required]
    [StringLength(255)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(255)]
    public string Slug { get; set; } = string.Empty;

    [StringLength(1000)]
    public string Description { get; set; } = string.Empty;

    [StringLength(255)]
    public string? Image { get; set; }

    [StringLength(255)]
    public string? Video { get; set; }

    [Range(0, long.MaxValue)]
    public long ViewCount { get; set; }

    [Required]
    public long PrivacyId { get; set; }

    [ForeignKey(nameof(PrivacyId))]
    public virtual VideoPrivacyEntity? Privacy { get; set; }

    [Required]
    public long LanguageId { get; set; }

    [ForeignKey(nameof(LanguageId))]
    public virtual VideoLanguageEntity? Language { get; set; }

    public virtual ICollection<VideoGenreEntity>? VideoGenres { get; set; } = new List<VideoGenreEntity>();
    public virtual ICollection<VideoTagEntity>? VideoTags { get; set; } = new List<VideoTagEntity>();
}
