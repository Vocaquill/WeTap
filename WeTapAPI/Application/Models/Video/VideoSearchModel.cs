using Application.Models.Search;

namespace Application.Models.Video;

public class VideoSearchModel : BaseSearchParamsModel
{
    public string? Q { get; set; } // Загальний пошук по всіх полях
    public string? Title { get; set; }
    public string? ChannelName { get; set; }
    public long? GenreId { get; set; }
    public long? TagId { get; set; }
    public string? CreateYearFrom { get; set; }
    public string? CreateYearTo { get; set; }
    public string? SortBy { get; set; } // сортування за популярністю, датою, рейтингом...
    public long? ChannelId { get; set; }
}
