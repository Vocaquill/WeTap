using Domain.Entities.Video;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Tag;

[Table("tbl_tags")]
public class TagEntity : BaseEntity<long>
{
    [Required]
    [StringLength(255)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(255)]
    public string Slug { get; set; } = string.Empty;

    public virtual ICollection<VideoTagEntity>? VideoTags { get; set; }
}