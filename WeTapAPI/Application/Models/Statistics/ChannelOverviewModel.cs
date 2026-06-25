namespace Application.Models.Statistics;

public class ChannelOverviewModel
{
    public long SubscriberCount { get; set; }
    public long TotalViewCount { get; set; }
    public long MonthlyViewCount { get; set; }
    public long TotalVideoCount { get; set; }
    public long TotalLikesCount { get; set; }
    public double AverageViewsPerVideo { get; set; }
}
