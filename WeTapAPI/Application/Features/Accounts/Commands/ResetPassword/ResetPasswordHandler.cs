using Domain.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Accounts.Commands.ResetPassword;

public class ResetPasswordHandler(UserManager<UserEntity> userManager) : IRequestHandler<ResetPasswordCommand>
{
    public async Task Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await userManager.Users.FirstOrDefaultAsync(x => x.Email == request.Model.Email && !x.IsDeleted);

        if (user != null)
            await userManager.ResetPasswordAsync(user, request.Model.Token, request.Model.NewPassword);
    }
}
