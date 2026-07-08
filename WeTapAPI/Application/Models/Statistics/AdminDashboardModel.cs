using Application.Models.Video;

namespace Application.Models.Statistics;

public class AdminDashboardModel
{
    public long TotalVideos { get; set; }
    public long TotalGenres { get; set; }
    public long TotalUsers { get; set; }
    public long NewUsersLastWeek { get; set; }
    public List<VideoItemModel> RecentVideos { get; set; } = new();
}
