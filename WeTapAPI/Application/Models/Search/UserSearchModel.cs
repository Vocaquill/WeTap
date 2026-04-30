namespace Application.Models.Search;

public class UserSearchModel : BaseSearchParamsModel
{
    public List<string>? Roles { get; set; }
    public string? Name { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}
