using Microsoft.AspNetCore.Http;

namespace Application.Models.Video;

public class VideoCreateModel
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; }
    public long[]? GenreIds { get; set; }
    public long[]? TagIds { get; set; }
    public IFormFile? Image { get; set; }
    public IFormFile? Video { get; set; }
    public long LanguageId { get; set; }
    public long PrivacyId { get; set; }
}
