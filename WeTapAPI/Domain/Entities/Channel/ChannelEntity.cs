using Domain.Entities.Video;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Domain.Entities.Identity;

namespace Domain.Entities.Channel;

[Table("tbl_channels")]
[Index(nameof(NickName), IsUnique = true)]
public class ChannelEntity : BaseEntity<long>
{
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(100)]
    public string NickName { get; set; } = string.Empty;

    [StringLength(1000)]
    public string Description { get; set; } = string.Empty;

    [StringLength(255)]
    public string? AvatarImage { get; set; }

    [StringLength(255)]
    public string? BannerImage { get; set; }

    public long UserId { get; set; }
    public virtual UserEntity? Author { get; set; }

    public virtual ICollection<VideoEntity>? Videos { get; set; } = new List<VideoEntity>();

    public virtual ICollection<ChannelSubscriberEntity>? Subscribers { get; set; } = new List<ChannelSubscriberEntity>();
}
