using Application.Models.Search;

namespace Application.Models.Video;

public class VideoSearchModel : BaseSearchParamsModel
{
    public string? Title { get; set; }
    public long? GenreId { get; set; }
    public string? CreateYearFrom { get; set; }
    public string? CreateYearTo { get; set; }
}
