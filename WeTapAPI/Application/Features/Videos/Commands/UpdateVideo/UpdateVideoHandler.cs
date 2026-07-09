using Application.Models.VideoProcessing;
using Application.Mappings;
using Domain.Entities.Video;
using Hangfire;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Application.Jobs;
using Application.Interfaces;

namespace Application.Features.Videos.Commands.UpdateVideo;

public class UpdateVideoHandler(
    IGenericRepository<VideoEntity, long> repo,
    VideoMappingProfile mapper,
    IImageService imageService,
    IVideoFileService videoFileService,
    IBackgroundJobClient backgroundJobClient,
    ICurrentUserService currentUserService
) : IRequestHandler<UpdateVideoCommand, VideoProcessingResult>
{
    public async Task<VideoProcessingResult> Handle(UpdateVideoCommand request, CancellationToken cancellationToken)
    {
        var model = request.Model;
        var currentUserId = currentUserService.GetCurrentUserId();

        var entity = await repo.AsQurable()
            .Include(x => x.VideoGenres)
            .Include(x => x.VideoTags)
            .FirstOrDefaultAsync(x => x.Id == model.Id && !x.IsDeleted, cancellationToken);


        if (entity!.ChannelId != currentUserId && !currentUserService.IsInRole(Application.Constants.Roles.Admin))
            throw new Exception("Ви не є власником цього відео");

        mapper.MapToEntity(model, entity);

        entity.VideoGenres.Clear();
        foreach (var genreId in model.GenreIds?.Distinct() ?? [])
        {
            entity.VideoGenres.Add(new VideoGenreEntity { GenreId = genreId });
        }

        entity.VideoTags.Clear();
        if (model.TagIds != null)
        {
            foreach (var tagId in model.TagIds.Distinct())
            {
                entity.VideoTags.Add(new VideoTagEntity { TagId = tagId });
            }
        }

        if (model.Image != null)
        {
            if (entity.Image != null)
                await imageService.DeleteImageAsync(entity.Image);

            entity.Image = await imageService.SaveImageAsync(model.Image);
        }

        var trackingId = Guid.NewGuid().ToString();

        if (model.Video != null)
        {
            if (entity.Video != null)
                await videoFileService.DeleteVideoAsync(entity.Video);

            entity.Video = "обробляється...";

            // Save video to temp path
            var tempPath = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid()}{Path.GetExtension(model.Video.FileName)}");
            using (var stream = new FileStream(tempPath, FileMode.Create))
            {
                await model.Video.CopyToAsync(stream);
            }

            backgroundJobClient.Enqueue<VideoProcessingJob>(job => 
                job.ProcessVideoAsync(entity.Id, tempPath, trackingId));
        }

        await repo.SaveChangesAsync();

        return new VideoProcessingResult { TrackingId = trackingId };
    }
}