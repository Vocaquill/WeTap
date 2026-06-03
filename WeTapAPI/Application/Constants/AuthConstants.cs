using System.IdentityModel.Tokens.Jwt;

namespace Application.Constants;

public static class AuthConstants
{
    public const string RolesClaim = "roles";

    public static readonly string[] UserIdClaimTypes =
    [
        JwtRegisteredClaimNames.Sub,
        "sub",
    ];
}
