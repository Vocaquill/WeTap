using Domain.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Accounts.Queries.ValidateResetToken;

public class ValidateResetTokenQueryHandler(UserManager<UserEntity> userManager) : IRequestHandler<ValidateResetTokenQuery, bool>
{
    public async Task<bool> Handle(ValidateResetTokenQuery request, CancellationToken cancellationToken)
    {
        var user = await userManager.Users.FirstOrDefaultAsync(x => x.Email == request.Model.Email && !x.IsDeleted);

        return await userManager.VerifyUserTokenAsync(
            user,
            TokenOptions.DefaultProvider,
            "ResetPassword",
            request.Model.Token);
    }
}
