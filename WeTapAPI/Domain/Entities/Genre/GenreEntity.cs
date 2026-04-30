using Domain.Entities.Video;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Domain.Entities.Genre;

[Table("tbl_genres")]
[Index(nameof(Slug), IsUnique = true)]
public class GenreEntity : BaseEntity<long>
{
    [StringLength(255)]
    public string Name { get; set; } = string.Empty;

    [StringLength(255)]
    public string Slug { get; set; } = string.Empty;

    [StringLength(255)]
    public string? Image { get; set; }

    public virtual ICollection<VideoGenreEntity>? VideoGenres { get; set; }
}
