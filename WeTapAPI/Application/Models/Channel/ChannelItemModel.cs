namespace Application.Models.Channel;

public class ChannelItemModel
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string NickName { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public string? AvatarImage { get; set; }
    public string? BannerImage { get; set; }
}
