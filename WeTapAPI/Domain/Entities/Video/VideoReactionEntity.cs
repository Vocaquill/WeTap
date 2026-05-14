using Domain.Entities.Identity;

namespace Domain.Entities.Video;

public class VideoReactionEntity : BaseEntity<long>
{
    public long VideoId { get; set; }
    public VideoEntity Video { get; set; } = null!;

    public long UserId { get; set; }
    public UserEntity User { get; set; } = null!;

    public bool IsLike { get; set; }
}
