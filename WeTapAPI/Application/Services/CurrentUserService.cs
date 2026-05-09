using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Application.Services;

public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    public long GetCurrentUserId()
    {
        var userId = TryGetCurrentUserId();

        if (userId is null)
            throw new UnauthorizedAccessException(
                "Користувач не пройшов автентифікацію або відсутня заявка NameIdentifier.");

        return userId.Value;
    }

    public long? TryGetCurrentUserId()
    {
        var claim = httpContextAccessor.HttpContext?
            .User
            .FindFirstValue(ClaimTypes.NameIdentifier);

        if (claim is null)
            return null;

        return long.TryParse(claim, out var id) ? id : null;
    }
}