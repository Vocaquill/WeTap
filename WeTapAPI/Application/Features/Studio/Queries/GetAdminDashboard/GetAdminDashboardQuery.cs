using Application.Models.Statistics;
using MediatR;

namespace Application.Features.Studio.Queries.GetAdminDashboard;

public record GetAdminDashboardQuery : IRequest<AdminDashboardModel>;
