using Domain.Entities.Genre;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities.Video;

public class VideoGenresEntity
{
    public long VideoId { get; set; }
    public long GenreId { get; set; }

    public virtual VideoEntity Video { get; set; }
    public virtual GenreEntity Genre { get; set; }
}
