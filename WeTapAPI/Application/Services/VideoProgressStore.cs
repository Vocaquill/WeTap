using System.Collections.Concurrent;
using Application.Interfaces;
using Application.Models.VideoProcessing;
using Microsoft.Extensions.Logging;

namespace Application.Services;

public class VideoProgressStore(ILogger<VideoProgressStore> logger) : IVideoProgressStore
{
    private readonly ConcurrentDictionary<string, VideoProgressUpdate> _progress = new();

    public void Set(string trackingId, VideoProgressUpdate update)
    {
        _progress[trackingId] = update;
        logger.LogInformation(
            "[VideoProgress] Store SET trackingId={TrackingId} status={Status} percentage={Percentage}",
            trackingId,
            update.Status,
            update.Percentage);
    }

    public VideoProgressUpdate? Get(string trackingId)
    {
        var found = _progress.TryGetValue(trackingId, out var update);

        logger.LogInformation(
            "[VideoProgress] Store GET trackingId={TrackingId} found={Found} status={Status} percentage={Percentage}",
            trackingId,
            found,
            found ? update!.Status : null,
            found ? update!.Percentage : null);

        return found ? update : null;
    }
}
