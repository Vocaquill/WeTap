using Application.Interfaces;
using Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Application.Services;

public class JwtTokenService(IConfiguration configuration,
    UserManager<UserEntity> userManager) : IJwtTokenService
{
    public async Task<string> CreateTokenAsync(UserEntity user)
    {
        var key = configuration["Jwt:Key"];

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim("email", user.Email),
            new Claim("name", $"{user.LastName} {user.FirstName}"),
            new Claim("image", $"{user.Image}")
        };
        foreach (var role in await userManager.GetRolesAsync(user))
        {
            claims.Add(new Claim("roles", role));
        }

        var keyBytes = System.Text.Encoding.UTF8.GetBytes(key);

        var symmetricSecurityKey = new SymmetricSecurityKey(keyBytes);

        var signingCredentials = new SigningCredentials(
            symmetricSecurityKey,
            SecurityAlgorithms.HmacSha256);

        var jwtSecurityToken = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: signingCredentials);

        string token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);

        return token;
    }
}
