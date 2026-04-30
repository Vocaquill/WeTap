using Application.Features.Genres.Queries.GetGenres;
using Application.Interfaces;
using Application.Models.Genre;
using Application.Models.User;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Users.Queries.GetUsers;

public class GetUsersQueryHandler(UserManager<UserEntity> userManager,
    IMapper mapper,
    IUserService userService) : IRequestHandler<GetUsersQuery, List<UserItemModel>>
{
    public async Task<List<UserItemModel>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await userManager.Users
            .Where(x => !x.IsDeleted)
            .ProjectTo<UserItemModel>(mapper.ConfigurationProvider)
            .ToListAsync();

        await userService.LoadLoginsAndRolesAsync(users);

        return users;
    }
}
