using Domain.Entities.Genre;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Domain.Entities.Video;

[Table("tbl_videos_genres")]
public class VideoGenreEntity
{
    public long VideoId { get; set; }
    public long GenreId { get; set; }

    public virtual VideoEntity Video { get; set; }
    public virtual GenreEntity Genre { get; set; }
}
