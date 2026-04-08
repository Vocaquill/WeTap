using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

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
    }

    public async Task<string> SaveVideoAsync(IFormFile file)
    {
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(ext))
            throw new InvalidOperationException("Unsupported video format");

        var fileName = $"{Guid.NewGuid()}{ext}";
        var path = Path.Combine(videosDir, fileName);

        await using var stream = new FileStream(path, FileMode.Create);
        await file.CopyToAsync(stream);

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
