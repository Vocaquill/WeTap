using Application.Interfaces;
using Application.Jobs;
using Application.Models.VideoProcessing;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities.Video;
using Hangfire;
using MediatR;

namespace Application.Features.Videos.Commands.CreateVideo;

public class CreateVideoHandler(IGenericRepository<VideoEntity, long> repo,
    IMapper mapper,
    IImageService imageService,
    IVideoFileService videoFileService,
    IBackgroundJobClient backgroundJobClient
    )
    : IRequestHandler<CreateVideoCommand, VideoProcessingResult>
{
    public async Task<VideoProcessingResult> Handle(CreateVideoCommand request, CancellationToken cancellationToken)
    {
        var entity = mapper.Map<VideoEntity>(request.Model);

        foreach (var genreId in request.Model.GenreIds.Distinct())
        {
            entity.VideoGenres.Add(new VideoGenreEntity { GenreId = genreId });
        }

        if (request.Model.TagIds != null)
        {
            foreach (var tagId in request.Model.TagIds.Distinct())
            {
                entity.VideoTags.Add(new VideoTagEntity { TagId = tagId });
            }
        }

        if (request.Model.Image != null)
            entity.Image = await imageService.SaveImageAsync(request.Model.Image);

        // We set a placeholder for video because it will be updated by the job
        entity.Video = "processing..."; 

        await repo.AddAsync(entity);
        await repo.SaveChangesAsync();

        var trackingId = Guid.NewGuid().ToString();

        if (request.Model.Video != null)
        {
            // Save video to a permanent temp path for Hangfire
            var tempPath = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid()}{Path.GetExtension(request.Model.Video.FileName)}");
            using (var stream = new FileStream(tempPath, FileMode.Create))
            {
                await request.Model.Video.CopyToAsync(stream);
            }

            // Queue processing job
            backgroundJobClient.Enqueue<VideoProcessingJob>(job => 
                job.ProcessVideoAsync(entity.Id, tempPath, trackingId));
        }

        return new VideoProcessingResult { TrackingId = trackingId };
    }
}
