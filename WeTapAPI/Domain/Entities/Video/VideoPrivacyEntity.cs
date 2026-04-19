using System.ComponentModel.DataAnnotations;

namespace Domain.Entities.Video;

public class VideoPrivacyEntity : BaseEntity<long>
{
    [Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string SystemCode { get; set; } = string.Empty;

    public virtual ICollection<VideoEntity>? Videos { get; set; } = new List<VideoEntity>();
}
