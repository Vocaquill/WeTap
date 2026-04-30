using Application.Constants;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Features.Accounts.Commands.Register;

public class RegisterHandler(UserManager<UserEntity> userManager,
    IJwtTokenService jwtTokenService,
    IMapper mapper,
    IImageService imageService) : IRequestHandler<RegisterCommand, string>
{
    public async Task<string> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var user = mapper.Map<UserEntity>(request.Model);

        user.Image = await imageService.SaveImageAsync(request.Model.ImageFile);

        var result = await userManager.CreateAsync(user, request.Model.Password);
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(user, Roles.User);
            return await jwtTokenService.CreateTokenAsync(user);
        }
        throw new Exception("Registration failed");
    }
}
