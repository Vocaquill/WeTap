using Application.Interfaces;
using Application.Mappings;
using Application.Models.Account;
using Domain.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Application.Features.Accounts.Commands.GoogleLogin;

public class GoogleLoginHandler(UserManager<UserEntity> userManager,
    IJwtTokenService tokenService,
    UserMapping mapper,
    IImageService imageService, 
    IConfiguration configuration) : IRequestHandler<GoogleLoginCommand, string>
{
    public async Task<string> Handle(GoogleLoginCommand request, CancellationToken cancellationToken)
    {
        using var httpClient = new HttpClient();

        httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", request.Model.Token);

        string userInfo = configuration["GoogleUserInfo"] ?? "https://www.googleapis.com/oauth2/v2/userinfo";
        var response = await httpClient.GetAsync(userInfo);

        if (!response.IsSuccessStatusCode)
            return null;

        var json = await response.Content.ReadAsStringAsync();

        var googleUser = JsonSerializer.Deserialize<AccountGoogleAccountModel>(json);

        var existingUser = await userManager.FindByEmailAsync(googleUser!.Email);
        if (existingUser != null)
        {
            var userLoginGoogle = await userManager.FindByLoginAsync("Google", googleUser.GoogleId);

            if (userLoginGoogle == null)
            {
                await userManager.AddLoginAsync(existingUser, new UserLoginInfo("Google", googleUser.GoogleId, "Google"));
            }
            var jwtToken = await tokenService.CreateTokenAsync(existingUser);
            return jwtToken;
        }
        else
        {
            var user = mapper.MapToEntity(googleUser);

            if (!String.IsNullOrEmpty(googleUser.Picture))
            {
                user.Image = await imageService.SaveImageFromUrlAsync(googleUser.Picture);
            }

            var result = await userManager.CreateAsync(user);
            if (result.Succeeded)
            {

                result = await userManager.AddLoginAsync(user, new UserLoginInfo(
                    loginProvider: "Google",
                    providerKey: googleUser.GoogleId,
                    providerDisplayName: "Google"
                ));

                await userManager.AddToRoleAsync(user, "User");
                var jwtToken = await tokenService.CreateTokenAsync(user);
                return jwtToken;
            }
        }

        return string.Empty;
    }
}
