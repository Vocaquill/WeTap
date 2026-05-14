namespace Application.Interfaces;

public interface IAuthService
{
    Task<long> GetUserId();
}
