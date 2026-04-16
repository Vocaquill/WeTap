using Application.Models.Search;

namespace Application.Models.Genre;

public class GenreSearchModel : BaseSearchParamsModel
{
    public string? Q { get; set; } // Загальний пошук по всіх полях
    public string? Name { get; set; }
    public string? Slug { get; set; }
    public string? SortBy { get; set; } // сортування за назвою...
}
