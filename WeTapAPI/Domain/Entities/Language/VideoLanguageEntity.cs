using Domain.Entities.Video;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Language;

[Table("tbl_video_languages")]
[Index(nameof(LanguageCode), IsUnique = true)]
public class VideoLanguageEntity : BaseEntity<long>
{
    [Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string LanguageCode { get; set; } = string.Empty;

    public virtual ICollection<VideoEntity>? Videos { get; set; } = new List<VideoEntity>();
}
