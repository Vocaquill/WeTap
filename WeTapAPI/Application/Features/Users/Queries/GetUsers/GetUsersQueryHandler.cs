using Application.Interfaces;
using Application.Mappings;
using Application.Models.User;
using Domain.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Users.Queries.GetUsers;

public class GetUsersQueryHandler(UserManager<UserEntity> userManager,
    UserMapping mapper,
    IUserService userService) : IRequestHandler<GetUsersQuery, List<UserItemModel>>
{
    public async Task<List<UserItemModel>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await mapper.ProjectToItemModel(
            userManager.Users.Where(x => !x.IsDeleted))
            .ToListAsync();

        await userService.LoadLoginsAndRolesAsync(users);

        return users;
    }
}
