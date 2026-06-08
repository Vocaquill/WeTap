using Application.Interfaces;
using Application.Mappings;
using Application.Models.User;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Users.Queries.GetUserById;

public class GetUserByIdQueryHandler(AppDbContext context,
    UserMapping mapper,
    IUserService userService) : IRequestHandler<GetUserByIdQuery, UserItemModel>
{
    public async Task<UserItemModel> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var user = await context.Users.FirstOrDefaultAsync(x => x.Id == request.Id && !x.IsDeleted);
        if (user == null)
            return null;

        var adminUser = mapper.MapToItemModel(user);

        await userService.LoadLoginsAndRolesAsync(new List<UserItemModel> { adminUser });

        return adminUser;
    }
}
