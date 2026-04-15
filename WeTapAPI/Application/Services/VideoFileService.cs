using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Xabe.FFmpeg;
using Xabe.FFmpeg.Downloader;

namespace Application.Services;

public class VideoFileService : IVideoFileService
{
    private readonly string _videosDir;
    private readonly List<int> _videoSizes;

    public VideoFileService(IConfiguration configuration)
    {
        _videosDir = Path.Combine(Directory.GetCurrentDirectory(), configuration["VideosDir"]!);
        _videoSizes = configuration.GetSection("VideoSizes").Get<List<int>>()!;

        Directory.CreateDirectory(_videosDir);

        // Завантаження FFmpeg (краще робити це один раз при старті додатка, але залишаємо логіку тут)
        FFmpegDownloader.GetLatestVersion(FFmpegVersion.Official).GetAwaiter().GetResult();
    }

    public async Task<string> SaveVideoAsync(IFormFile file)
    {
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
            if (File.Exists(tempInputPath)) File.Delete(tempInputPath);
        }
    }

    public async Task<string> SaveVideoFromFilePathAsync(string filePath)
    {
        if (!File.Exists(filePath))
            throw new FileNotFoundException("Source video file not found", filePath);

        var mediaInfo = await FFmpeg.GetMediaInfo(filePath);
        string baseFileName = $"{Guid.NewGuid()}.mp4";

        var tasks = _videoSizes.Select(size => ProcessVideoAsync(filePath, baseFileName, size, mediaInfo));

        await Task.WhenAll(tasks);

        return baseFileName;
    }

    private async Task ProcessVideoAsync(string inputPath, string baseName, int height, IMediaInfo mediaInfo)
    {
        var outputPath = Path.Combine(_videosDir, $"{height}_{baseName}");

        var videoStream = mediaInfo.VideoStreams.FirstOrDefault();
        var audioStream = mediaInfo.AudioStreams.FirstOrDefault();

        if (videoStream == null) return;

        // Розраховуємо ширину, щоб зберегти пропорції (повинна бути кратна 2 для кодека H.264)
        // Формула: (оригінальна_ширина * цільова_висота) / оригінальна_висота
        double ratio = (double)videoStream.Width / videoStream.Height;
        int width = (int)(height * ratio);
        if (width % 2 != 0) width++;

        var vStream = videoStream
            .SetSize(width, height)
            .SetCodec(VideoCodec.h264);

        var conversion = FFmpeg.Conversions.New().AddStream(vStream);

        // Додаємо аудіо, якщо воно є
        if (audioStream != null)
        {
            conversion.AddStream(audioStream.SetCodec(AudioCodec.aac));
        }

        await conversion.SetOutput(outputPath).Start();
    }

    public async Task DeleteVideoAsync(string name)
    {
        var tasks = _videoSizes.Select(size => Task.Run(() =>
        {
            var path = Path.Combine(_videosDir, $"{size}_{name}");
            if (File.Exists(path)) File.Delete(path);
        }));

        await Task.WhenAll(tasks);
    }
}