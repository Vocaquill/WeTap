namespace Application.Models.Language;

public class LanguageUpdateModel
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string LanguageCode { get; set; } = string.Empty;
}
