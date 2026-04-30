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
    private readonly string _ffmpegPath;
    private readonly List<int> _videoSizes;

    public VideoFileService(IConfiguration configuration)
    {
        _videosDir = Path.Combine(Directory.GetCurrentDirectory(), configuration["VideosDir"]!);
        _videoSizes = configuration.GetSection("VideoSizes").Get<List<int>>()!;
        _ffmpegPath = Path.Combine(Directory.GetCurrentDirectory(), "FFmpeg");

        Directory.CreateDirectory(_videosDir);

        FFmpeg.SetExecutablesPath(_ffmpegPath);
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
        // Завантаження FFmpeg
        await FFmpegDownloader.GetLatestVersion(FFmpegVersion.Official, _ffmpegPath);

        var mediaInfo = await FFmpeg.GetMediaInfo(filePath);
        string baseFileName = $"{Guid.NewGuid()}.mp4";

        // Фіксуємо час початку обробки
        var startTime = DateTime.UtcNow;

        // Словник, де ми зберігаємо прогрес для кожного розміру (напр: 720: 15%, 1080: 10%)
        var progressDict = new ConcurrentDictionary<int, double>();
        foreach (var size in _videoSizes) progressDict[size] = 0;

        // Створюємо список задач для одночасної обробки відео в різних розмірах
        var tasks = _videoSizes.Select(size => ProcessVideoAsync(filePath, baseFileName, size, mediaInfo, (percent) =>
        {
            // цей лямбда-вираз виконується кожного разу, коли FFmpeg повідомить про прогрес

            // Оновлюємо відсоток саме для цієї роздільної здатності
            progressDict[size] = percent;

            // Рахуємо середній прогрес по всіх задачах разом
            var totalProgress = progressDict.Values.Average();

            // Розрахунок часу
            string remainingTimeText = "Calculating...";
            if (totalProgress > 0)
            {
                // Скільки часу вже пройшло
                var elapsed = DateTime.UtcNow - startTime;

                // Пропорція: якщо X відсотків зайняло Y часу, то 100% займе (Y / X) * 100
                // Залишок часу = [загальний очікуваний час] - [той, що вже пройшов]
                var totalEstimatedTime = TimeSpan.FromTicks((long)(elapsed.Ticks / (totalProgress / 100)));
                var remaining = totalEstimatedTime - elapsed;

                remainingTimeText = remaining.TotalHours >= 1
                    ? remaining.ToString(@"hh\:mm\:ss")
                    : remaining.ToString(@"mm\:ss");
            }

            // Викликаємо зовнішній колбек
            onProgress(new VideoProgressUpdate
            {
                Percentage = Math.Round(totalProgress, 2),
                Status = "Processing",
                EstimatedTimeRemaining = remainingTimeText
            });
        }));

        // Чекаємо, поки розміри відео будуть готові
        await Task.WhenAll(tasks);

        return baseFileName;
    }

    private async Task ProcessVideoAsync(string inputPath, string baseName, int height, IMediaInfo mediaInfo, Action<double>? onProgress = null)
    {
        var outputPath = Path.Combine(_videosDir, $"{height}_{baseName}");
        var videoStream = mediaInfo.VideoStreams.FirstOrDefault();
        var audioStream = mediaInfo.AudioStreams.FirstOrDefault();

        if (videoStream == null) return;

        // Математика для збереження пропорцій сторін
        double ratio = (double)videoStream.Width / videoStream.Height;
        int width = (int)(height * ratio);
        if (width % 2 != 0) width++;

        var vStream = videoStream
            .SetSize(width, height)
            .SetCodec(VideoCodec.h264);

        // Створюємо команду для конвертації
        var conversion = FFmpeg.Conversions.New().AddStream(vStream);
        if (audioStream != null) conversion.AddStream(audioStream.SetCodec(AudioCodec.aac));

        if (onProgress != null)
        {
            // conversion.OnProgress — це подія всередині бібліотеки Xabe.FFmpeg.
            // Вона спрацьовує, коли FFmpeg виводить у консоль рядок типу "frame= 123 fps=..."
            // Бібліотека парсить цей рядок, рахує відсоток (оброблені кадри / загальні кадри)
            // і віддає нам готове число 'args.Percent'.
            conversion.OnProgress += (sender, args) => onProgress(args.Percent);
        }

        // Запуск процесу FFmpeg.exe
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