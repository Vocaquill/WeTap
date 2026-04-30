namespace Application.Constants;

public static class FileConstants
{
    public static readonly string[] AllowedImageExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
    public static readonly string[] AllowedImageContentTypes = { "image/jpeg", "image/png", "image/webp" };
    
    public static readonly string[] AllowedVideoExtensions = { ".mp4", ".avi", ".mkv", ".mov" };
    public static readonly string[] AllowedVideoContentTypes = { "video/mp4", "video/x-msvideo", "video/x-matroska", "video/quicktime" };
}
