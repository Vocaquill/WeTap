namespace Application.Interfaces;

public interface ICurrentUserService
{
    bool IsAuthenticated { get; }

    long GetCurrentUserId();

    long? TryGetCurrentUserId();

    bool IsInRole(string role);
}