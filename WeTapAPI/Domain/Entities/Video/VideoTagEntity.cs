using Domain.Entities.Tag;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities.Video;

[Table("tbl_videos_tags")]
public class VideoTagEntity
{
    public long VideoId { get; set; }
    public long TagId { get; set; }

    public virtual VideoEntity Video { get; set; }
    public virtual TagEntity Tag { get; set; }
}