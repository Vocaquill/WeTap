using Application.Models.Search;

namespace Application.Models.Channel;

public class ChannelSearchModel : BaseSearchParamsModel
{
    public string? Q { get; set; }
}
