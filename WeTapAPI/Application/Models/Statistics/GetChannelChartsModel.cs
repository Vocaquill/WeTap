namespace Application.Models.Statistics;

public class GetChannelChartsModel
{
    public long? ChannelId { get; set; }
    public DateTime From { get; set; }
    public DateTime To { get; set; }
}