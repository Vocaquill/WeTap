using Application.Models.Video;

namespace Application.Models.Statistics;

public class ChannelStatisticsModel
{
    public ChannelOverviewModel Overview { get; set; } = new();
    public List<ChannelSubscriberItemModel> RecentSubscribers { get; set; } = new();
    public VideoItemModel? MostPopularVideo { get; set; }
}
