using Application.Constants;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Text.Json;

namespace Application.Services;

public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    private ClaimsPrincipal? Principal => httpContextAccessor.HttpContext?.User;

    public bool IsAuthenticated => Principal?.Identity?.IsAuthenticated == true;

    public long GetCurrentUserId()
    {
        var userId = TryGetCurrentUserId();

        if (userId is null)
            throw new UnauthorizedAccessException(
                "Користувач не пройшов автентифікацію або відсутній claim sub.");

        return userId.Value;
    }

    public long? TryGetCurrentUserId()
    {
        var user = Principal;
        if (user is null || user.Identity?.IsAuthenticated != true)
            return null;

        foreach (var claimType in AuthConstants.UserIdClaimTypes)
        {
            var value = user.FindFirstValue(claimType);
            if (long.TryParse(value, out var id))
                return id;
        }

        return null;
    }

    public bool IsInRole(string role)
    {
        var user = Principal;
        if (user is null || user.Identity?.IsAuthenticated != true)
            return false;

        return GetRoles(user).Contains(role, StringComparer.OrdinalIgnoreCase);
    }

    private static IReadOnlyList<string> GetRoles(ClaimsPrincipal user)
    {
        var rolesClaim = user.FindFirstValue(AuthConstants.RolesClaim);
        if (string.IsNullOrWhiteSpace(rolesClaim))
            return [];

        if (rolesClaim.StartsWith('['))
        {
            return JsonSerializer.Deserialize<List<string>>(rolesClaim) ?? [];
        }

        return [rolesClaim];
    }
}
