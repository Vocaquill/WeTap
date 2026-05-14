using Application.Interfaces;
using Domain.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Features.Accounts.Commands.ChangePassword;

public class ChangePasswordHandler(UserManager<UserEntity> userManager,
    IAuthService authService) : IRequestHandler<ChangePasswordCommand>
{
    public async Task Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByIdAsync((await authService.GetUserId()).ToString());


        if (user != null)
        {
            IdentityResult res;

            if (await userManager.HasPasswordAsync(user))
            {
                res = await userManager.ChangePasswordAsync(user, request.Model.OldPassword, request.Model.NewPassword);
            }
            else
            {
                res = await userManager.AddPasswordAsync(user, request.Model.NewPassword);
            }


            if (!res.Succeeded)
            {
                throw new Exception("Failed to change password: " + string.Join(", ", res.Errors.Select(e => e.Description)));
            }
        }
    }
}
