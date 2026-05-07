using Microsoft.AspNetCore.Http;

namespace Application.Models.Channel;

public class ChannelUpdateModel
{
    public long Id { get; set; }
    public string? Name { get; set; } = string.Empty;
    public string? NickName { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public IFormFile? AvatarImage { get; set; }
    public IFormFile? BannerImage { get; set; }
}
