using Application.Models.Search;
using Application.Models.User;
using MediatR;

namespace Application.Features.Users.Queries.SearchUsers;

public record SearchUsersQuery(UserSearchModel SearchModel) : IRequest<SearchResult<UserItemModel>>;
