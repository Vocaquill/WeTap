using Application.Models.Search;
using Application.Models.User;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Users.Queries.SearchUsers;

public class SearchUsersQueryHandler(UserManager<UserEntity> userManager,
    IMapper mapper) : IRequestHandler<SearchUsersQuery, SearchResult<UserItemModel>>
{
    public async Task<SearchResult<UserItemModel>> Handle(SearchUsersQuery request, CancellationToken cancellationToken)
    {
        var query = userManager.Users.Where(x => !x.IsDeleted).AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.SearchModel.Name))
        {
            string nameFilter = request.SearchModel.Name.Trim().ToLower().Normalize();

            query = query.Where(u =>
                (u.FirstName + " " + u.LastName).ToLower().Contains(nameFilter) ||
                u.FirstName.ToLower().Contains(nameFilter) ||
                u.LastName.ToLower().Contains(nameFilter));
        }

        //if (request.SearchModel.StartDate != null)
        //{
        //    query = query.Where(u => u.DateCreated >= request.SearchModel.StartDate);
        //}

        //if (request.SearchModel.EndDate != null)
        //{
        //    query = query.Where(u => u.DateCreated <= request.SearchModel.EndDate);
        //}

        if (request.SearchModel.Roles != null && request.SearchModel.Roles.Any())
        {
            query = query.Where(u => u.UserRoles.Any(ur => request.SearchModel.Roles.Contains(ur.Role.Name)));
        }

        var totalCount = await query.CountAsync();

        var safeItemsPerPage = request.SearchModel.ItemPerPage < 1 ? 10 : request.SearchModel.ItemPerPage;
        var totalPages = (int)Math.Ceiling(totalCount / (double)safeItemsPerPage);
        var safePage = Math.Min(Math.Max(1, request.SearchModel.Page), Math.Max(1, totalPages));

        var users = await query
            .OrderBy(u => u.Id)
            .Skip((safePage - 1) * safeItemsPerPage)
            .Take(safeItemsPerPage)
            .ProjectTo<UserItemModel>(mapper.ConfigurationProvider)
            .ToListAsync();

        return new SearchResult<UserItemModel>
        {
            Items = users,
            Pagination = new PaginationModel
            {
                TotalCount = totalCount,
                TotalPages = totalPages,
                ItemsPerPage = safeItemsPerPage,
                CurrentPage = safePage
            }
        };
    }
}
