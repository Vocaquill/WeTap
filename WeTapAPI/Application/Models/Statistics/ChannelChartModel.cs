using System.Text.Json.Serialization;

namespace Application.Models.Statistics;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ChartMetricType
{
    Views,
    Subscribers,
    Likes
}

public class ChartDataPointModel
{
    public string Date { get; set; } = string.Empty;
    public long Value { get; set; }
}

public class ChannelChartModel
{
    public ChartMetricType Metric { get; set; }
    public List<ChartDataPointModel> DataPoints { get; set; } = new();
}
