using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Xabe.FFmpeg;
using Xabe.FFmpeg.Downloader;

using System.Collections.Concurrent;
using Application.Models.VideoProcessing;

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

        // Завантаження FFmpeg
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
        return await SaveVideoWithProgressAsync(filePath, _ => { });
    }

    public async Task<string> SaveVideoWithProgressAsync(string filePath, Action<VideoProgressUpdate> onProgress)
    {
        if (!File.Exists(filePath))
            throw new FileNotFoundException("Source video file not found", filePath);

        var mediaInfo = await FFmpeg.GetMediaInfo(filePath);
        string baseFileName = $"{Guid.NewGuid()}.mp4";

        var progressDict = new ConcurrentDictionary<int, double>();
        foreach (var size in _videoSizes) progressDict[size] = 0;

        var tasks = _videoSizes.Select(size => ProcessVideoAsync(filePath, baseFileName, size, mediaInfo, (percent) =>
        {
            progressDict[size] = percent;
            var totalProgress = progressDict.Values.Average();
            onProgress(new VideoProgressUpdate
            {
                Percentage = Math.Round(totalProgress, 2),
                Status = "Processing",
                EstimatedTimeRemaining = "..."
            });
        }));

        await Task.WhenAll(tasks);

        return baseFileName;
    }

    private async Task ProcessVideoAsync(string inputPath, string baseName, int height, IMediaInfo mediaInfo, Action<double>? onProgress = null)
    {
        var outputPath = Path.Combine(_videosDir, $"{height}_{baseName}");

        var videoStream = mediaInfo.VideoStreams.FirstOrDefault();
        var audioStream = mediaInfo.AudioStreams.FirstOrDefault();

        if (videoStream == null) return;

        // Розраховуємо ширину, щоб зберегти пропорції (повинна бути кратна 2 для кодека H.264)
        double ratio = (double)videoStream.Width / videoStream.Height;
        int width = (int)(height * ratio);
        if (width % 2 != 0) width++;

        var vStream = videoStream
            .SetSize(width, height)
            .SetCodec(VideoCodec.h264);

        var conversion = FFmpeg.Conversions.New().AddStream(vStream);

        if (audioStream != null)
        {
            conversion.AddStream(audioStream.SetCodec(AudioCodec.aac));
        }

        if (onProgress != null)
        {
            conversion.OnProgress += (sender, args) => onProgress(args.Percent);
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