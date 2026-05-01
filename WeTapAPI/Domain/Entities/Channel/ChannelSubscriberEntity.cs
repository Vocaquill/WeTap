using Domain.Entities.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Channel;

[Table("tbl_channel_subscribers")]
public class ChannelSubscriberEntity
{
    public long ChannelId { get; set; }
    public virtual ChannelEntity? Channel { get; set; }

    public long UserId { get; set; }
    public virtual UserEntity? User { get; set; }

    public DateTime DateSubscribed { get; set; } = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Utc);
}
