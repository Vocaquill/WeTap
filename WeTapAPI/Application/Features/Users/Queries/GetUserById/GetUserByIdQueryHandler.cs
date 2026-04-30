using Application.Features.Users.Queries.GetUsers;
using Application.Interfaces;
using Application.Models.User;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Users.Queries.GetUserById;

public class GetUserByIdQueryHandler(AppDbContext context, 
    IMapper mapper,
    IUserService userService) : IRequestHandler<GetUserByIdQuery, UserItemModel>
{
    public async Task<UserItemModel> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var user = await context.Users.FirstOrDefaultAsync(x => x.Id == request.Id && !x.IsDeleted);
        if (user == null)
            return null;

        var adminUser = mapper.Map<UserItemModel>(user);

        await userService.LoadLoginsAndRolesAsync(new List<UserItemModel> { adminUser });

        return adminUser;
    }
}
