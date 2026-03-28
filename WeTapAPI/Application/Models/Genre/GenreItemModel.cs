namespace Application.Models.Genre;

public class GenreItemModel
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Image { get; set; }
}
