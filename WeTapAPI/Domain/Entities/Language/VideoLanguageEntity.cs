using Domain.Entities.Video;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities.Language;

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
