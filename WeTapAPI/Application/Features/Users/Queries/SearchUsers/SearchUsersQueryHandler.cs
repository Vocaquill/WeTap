using Application.Interfaces;
using Application.Mappings;
using Application.Models.Search;
using Application.Models.User;
using Domain.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Users.Queries.SearchUsers;

public class SearchUsersQueryHandler(UserManager<UserEntity> userManager,
    UserMapping mapper,
    ICurrentUserService currentUserService) : IRequestHandler<SearchUsersQuery, SearchResult<UserItemModel>>
{
    public async Task<SearchResult<UserItemModel>> Handle(SearchUsersQuery request, CancellationToken cancellationToken)
    {
        var loginUserId = currentUserService.GetCurrentUserId();

        var query = userManager.Users.Where(x => !x.IsDeleted).Where(x => x.Id != loginUserId).AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.SearchModel.Query))
        {
            string nameFilter = request.SearchModel.Query.Trim().ToLower().Normalize();

            query = query.Where(u =>
                (u.FirstName + " " + u.LastName).ToLower().Contains(nameFilter) ||
                u.FirstName.ToLower().Contains(nameFilter) ||
                u.LastName.ToLower().Contains(nameFilter));
        }

        if (!string.IsNullOrWhiteSpace(request.SearchModel.FirstName))
        {
            string firstNameFilter = request.SearchModel.FirstName?.Trim().ToLower().Normalize();

            if (!string.IsNullOrWhiteSpace(firstNameFilter))
            {
                query = query.Where(u =>
                    u.FirstName.ToLower().Contains(firstNameFilter));
            }
        }

        if (!string.IsNullOrWhiteSpace(request.SearchModel.LastName))
        {
            string lastNameFilter = request.SearchModel.LastName?.Trim().ToLower().Normalize();

            if (!string.IsNullOrWhiteSpace(lastNameFilter))
            {
                query = query.Where(u =>
                    u.LastName.ToLower().Contains(lastNameFilter));
            }
        }

        if (!string.IsNullOrWhiteSpace(request.SearchModel.Email))
        {
            string emailFilter = request.SearchModel.Email.Trim().ToLower().Normalize();

            query = query.Where(u =>
                u.Email.ToLower().Contains(emailFilter));
        }

        if (request.SearchModel.Roles != null && request.SearchModel.Roles.Any())
        {
            query = query.Where(u => u.UserRoles.Any(ur => request.SearchModel.Roles.Contains(ur.Role.Name)));
        }


        if (request.SearchModel.SortBy == "email")
        {
            query = query.OrderBy(x => x.Email);
        }
        else if (request.SearchModel.SortBy == "firstName")
        {
            query = query.OrderBy(x => x.FirstName);
        }
        else if (request.SearchModel.SortBy == "lastName")
        {
            query = query.OrderBy(x => x.LastName);
        }
        else
        {
            query = query.OrderBy(x => x.Id);
        }


        var totalCount = await query.CountAsync();

        var safeItemsPerPage = request.SearchModel.ItemPerPage < 1 ? 10 : request.SearchModel.ItemPerPage;
        var totalPages = (int)Math.Ceiling(totalCount / (double)safeItemsPerPage);
        var safePage = Math.Min(Math.Max(1, request.SearchModel.Page), Math.Max(1, totalPages));

        var users = await mapper.ProjectToItemModel(
            query
                .Skip((safePage - 1) * safeItemsPerPage)
                .Take(safeItemsPerPage))
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
