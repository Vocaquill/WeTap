namespace Application.Models.Statistics;

public class ChannelSubscriberItemModel
{
    public string Name { get; set; } = string.Empty;
    public string NickName { get; set; } = string.Empty;
    public string? AvatarImage { get; set; }
    public string DateSubscribed { get; set; } = string.Empty;
}
