using Application.Constants;
using Application.Interfaces;
using Application.Mappings;
using Domain.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Features.Accounts.Commands.Register;

public class RegisterHandler(UserManager<UserEntity> userManager,
    IJwtTokenService jwtTokenService,
    UserMapping mapper,
    IImageService imageService,
    ICookieAuthService cookieAuthService) : IRequestHandler<RegisterCommand, string>
{
    public async Task<string> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var user = mapper.MapToEntity(request.Model);

        user.Image = await imageService.SaveImageAsync(request.Model.ImageFile);

        var result = await userManager.CreateAsync(user, request.Model.Password);
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(user, Roles.User);
            var token = await jwtTokenService.CreateTokenAsync(user);
            cookieAuthService.SetAuthCookie(token);
            return token;
        }
        throw new Exception("Registration failed");
    }
}
