namespace Application.Models.Search;

public class UserSearchModel : BaseSearchParamsModel
{
    public string Query { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Image { get; set; }
    public List<string>? Roles { get; set; }
    public string? SortBy { get; set; }
}
