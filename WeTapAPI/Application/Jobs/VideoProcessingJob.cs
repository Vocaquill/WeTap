using Application.Interfaces;
using Application.Models.VideoProcessing;
using Domain.Entities.Video;
using Microsoft.AspNetCore.SignalR;
using Application.Hubs;
using Microsoft.Extensions.Logging;

namespace Application.Jobs;

public class VideoProcessingJob(
    IHubContext<VideoProgressHub> hubContext,
    IVideoFileService videoFileService,
    IGenericRepository<VideoEntity, long> repo,
    ILogger<VideoProcessingJob> logger
)
{
    public async Task ProcessVideoAsync(long videoId, string tempFilePath, string trackingId)
    {
        logger.LogInformation("Starting background video processing for VideoId: {VideoId}, TrackingId: {TrackingId}", videoId, trackingId);
        
        try
        {
            if (!File.Exists(tempFilePath))
            {
                logger.LogError("Temp file not found at path: {TempPath}", tempFilePath);
                throw new FileNotFoundException("Temp file for video processing not found", tempFilePath);
            }

            await hubContext.Clients.Group(trackingId).SendAsync("ReceiveProgress", new VideoProgressUpdate
            {
                Percentage = 0,
                Status = "Starting",
                EstimatedTimeRemaining = "Calculating..."
            });

            logger.LogInformation("Calling VideoFileService to process video...");
            
            var baseFileName = await videoFileService.SaveVideoWithProgressAsync(tempFilePath, (progress) => {
                hubContext.Clients.Group(trackingId).SendAsync("ReceiveProgress", progress);
            });

            logger.LogInformation("Video processing finished. BaseFileName: {FileName}. Updating database...", baseFileName);

            // Update entity in DB
            var entity = await repo.GetByIdAsync(videoId);
            if (entity != null)
            {
                entity.Video = baseFileName;
                await repo.UpdateAsync(entity);
                await repo.SaveChangesAsync();
                logger.LogInformation("Database updated successfully for VideoId: {VideoId}", videoId);
            }
            else
            {
                logger.LogWarning("Video entity with Id {VideoId} not found in database after processing", videoId);
            }

            await hubContext.Clients.Group(trackingId).SendAsync("ReceiveProgress", new VideoProgressUpdate
            {
                Percentage = 100,
                Status = "Completed",
                EstimatedTimeRemaining = "00:00:00"
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error while processing video for TrackingId: {TrackingId}", trackingId);
            
            await hubContext.Clients.Group(trackingId).SendAsync("ReceiveProgress", new VideoProgressUpdate
            {
                Percentage = 0,
                Status = $"Error: {ex.Message}",
                EstimatedTimeRemaining = "N/A"
            });
            
            throw; // Прокидаємо помилку далі, щоб Hangfire показав її як Failed
        }
        finally
        {
            if (File.Exists(tempFilePath))
            {
                try 
                { 
                    File.Delete(tempFilePath); 
                    logger.LogInformation("Deleted temp file: {TempPath}", tempFilePath);
                } 
                catch (Exception deleteEx) 
                { 
                    logger.LogWarning(deleteEx, "Failed to delete temp file: {TempPath}", tempFilePath);
                }
            }
        }
    }
}
