using Microsoft.AspNetCore.Http;

namespace Application.Models.Genre;

public class GenreCreateModel
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public IFormFile? Image { get; set; }
}
