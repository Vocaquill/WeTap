namespace Application.Models.User;

public class UserSeedModel
{
    public string FirstName { get; set; } = String.Empty;
    public string LastName { get; set; } = String.Empty;
    public string Email { get; set; } = String.Empty;
    public string Password { get; set; } = String.Empty;
    public string? ImagePath { get; set; }
    public List<string> Roles { get; set; } = new();
}
