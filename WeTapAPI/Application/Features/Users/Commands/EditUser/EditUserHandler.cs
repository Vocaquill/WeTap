using Application.Interfaces;
using Application.Mappings;
using Application.Services;
using Domain;
using Domain.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Users.Commands.EditUser;

public class EditUserHandler(UserManager<UserEntity> userManager,
    AppDbContext context,
    UserMapping mapper,
    IImageService imageService,
    IJwtTokenService tokenService) : IRequestHandler<EditUserCommand, string>
{
    public async Task<string> Handle(EditUserCommand request, CancellationToken cancellationToken)
    {
        var existing = await userManager.FindByIdAsync(request.Model.Id.ToString());
        var userLogins = await context.UserLogins
            .FirstOrDefaultAsync(ul => ul.UserId == existing!.Id);

        if (userLogins != null && userLogins.LoginProvider == "Google" && existing!.Email != request.Model.Email)
            throw new InvalidOperationException("Cannot edit email for Google login user");

        mapper.MapToEntity(request.Model, existing);

        if (request.Model.Image != null)
        {
            imageService.DeleteImageAsync(existing.Image);
            existing.Image = await imageService.SaveImageAsync(request.Model.Image);
        }

        if (request.Model.Roles != null)
        {
            var currentRoles = await userManager.GetRolesAsync(existing);
            await userManager.RemoveFromRolesAsync(existing, currentRoles);
            await userManager.AddToRolesAsync(existing, request.Model.Roles);
        }

        await userManager.UpdateAsync(existing);

        var jwtToken = await tokenService.CreateTokenAsync(existing);
        return jwtToken;
    }
}
