namespace Application.Models.Search;

public class UserSearchModel : BaseSearchParamsModel
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Image { get; set; }
    public List<string>? Roles { get; set; }
    //public DateTime? StartDate { get; set; }
    //public DateTime? EndDate { get; set; }
}
