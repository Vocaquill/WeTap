using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Xabe.FFmpeg;
using Xabe.FFmpeg.Downloader;

namespace Application.Services;

public class VideoFileService : IVideoFileService
{
    private readonly string videosDir;
    private readonly string[] allowedExtensions = { ".mp4", ".mov", ".avi" };

    public VideoFileService(IConfiguration configuration)
    {
        videosDir = Path.Combine(
            Directory.GetCurrentDirectory(),
            configuration["VideosDir"]!
        );
        Directory.CreateDirectory(videosDir);

        // Це завантажить ffpmeg.exe у папку з додатком, якщо його там немає
        FFmpegDownloader.GetLatestVersion(FFmpegVersion.Official).Wait();
    }

    public async Task<string> SaveVideoAsync(IFormFile file)
    {
        // 1. Зберігаємо тимчасовий файл (оригінал)
        var tempInputPath = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString() + Path.GetExtension(file.FileName));
        using (var stream = new FileStream(tempInputPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        try
        {
            return await SaveVideoFromFilePathAsync(tempInputPath);
        }
        finally
        {
            // Видаляємо тимчасовий файл
            if (File.Exists(tempInputPath)) File.Delete(tempInputPath);
        }
    }

    public async Task<string> SaveVideoFromFilePathAsync(string filePath)
    {
        if (!File.Exists(filePath))
            throw new FileNotFoundException("Source video file not found", filePath);

        // 2. Готуємо шлях для фінального MP4
        var fileName = $"{Guid.NewGuid()}.mp4";
        var outputPath = Path.Combine(videosDir, fileName);

        // 3. Перекодовуємо в H.264 (відео) та AAC (аудіо) — це стандарт для вебу
        var conversion = await FFmpeg.Conversions.FromSnippet.ToMp4(filePath, outputPath);
        await conversion.Start();

        return fileName;
    }

    public Task DeleteVideoAsync(string name)
    {
        var path = Path.Combine(videosDir, name);
        if (File.Exists(path))
            File.Delete(path);

        return Task.CompletedTask;
    }
}
