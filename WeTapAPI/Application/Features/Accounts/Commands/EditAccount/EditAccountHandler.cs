using Application.Interfaces;
using AutoMapper;
using Domain;
using Domain.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Accounts.Commands.EditAccount;

public class EditAccountHandler(UserManager<UserEntity> userManager,
    AppDbContext context,
    IMapper mapper,
    IImageService imageService,
    IJwtTokenService tokenService,
    ICurrentUserService currentUserService) : IRequestHandler<EditAccountCommand, string>
{
    public async Task<string> Handle(EditAccountCommand request, CancellationToken cancellationToken)
    {
        var userId = currentUserService.GetCurrentUserId();
        request.Model.Id = userId;

        var existing = await userManager.FindByIdAsync(request.Model.Id.ToString());
        var userLogins = await context.UserLogins
            .FirstOrDefaultAsync(ul => ul.UserId == existing!.Id);

        if (userLogins != null && userLogins.LoginProvider == "Google" && existing!.Email != request.Model.Email)
            throw new InvalidOperationException("Cannot edit email for Google login user");

        existing = mapper.Map(request.Model, existing);

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
