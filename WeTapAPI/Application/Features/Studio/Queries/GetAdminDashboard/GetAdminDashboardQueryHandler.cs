using Application.Interfaces;
using Application.Mappings;
using Application.Models.Statistics;
using Domain.Entities.Genre;
using Domain.Entities.Identity;
using Domain.Entities.Video;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Studio.Queries.GetAdminDashboard;

public class GetAdminDashboardQueryHandler(
    IGenericRepository<VideoEntity, long> videoRepo,
    IGenericRepository<GenreEntity, long> genreRepo,
    UserManager<UserEntity> userManager,
    VideoMappingProfile videoMapper)
    : IRequestHandler<GetAdminDashboardQuery, AdminDashboardModel>
{
    public async Task<AdminDashboardModel> Handle(
        GetAdminDashboardQuery request,
        CancellationToken cancellationToken)
    {
        var weekAgo = DateTime.UtcNow.AddDays(-7);

        var totalVideos = await videoRepo.AsQurable()
            .LongCountAsync(v => !v.IsDeleted, cancellationToken);

        var totalGenres = await genreRepo.AsQurable()
            .LongCountAsync(g => !g.IsDeleted, cancellationToken);

        var totalUsers = await userManager.Users
            .LongCountAsync(u => !u.IsDeleted, cancellationToken);

        var newUsersLastWeek = await userManager.Users
            .LongCountAsync(u => !u.IsDeleted && u.DateCreated >= weekAgo, cancellationToken);

        var recentVideos = await videoMapper.ProjectToItemModel(
            videoRepo.AsQurable()
                .Where(v => !v.IsDeleted)
                .OrderByDescending(v => v.DateCreated)
                .Take(10)
        ).ToListAsync(cancellationToken);

        return new AdminDashboardModel
        {
            TotalVideos = totalVideos,
            TotalGenres = totalGenres,
            TotalUsers = totalUsers,
            NewUsersLastWeek = newUsersLastWeek,
            RecentVideos = recentVideos
        };
    }
}
