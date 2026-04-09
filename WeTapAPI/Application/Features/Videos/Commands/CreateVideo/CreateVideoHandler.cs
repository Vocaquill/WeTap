using Application.Interfaces;
using Application.Models.Video;
using AutoMapper;
using Domain.Entities.Video;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Videos.Commands.CreateVideo;

public class CreateVideoHandler(IGenericRepository<VideoEntity, long> repo,
    IMapper mapper,
    IImageService imageService,
    IVideoFileService videoFileService
    )
    : IRequestHandler<CreateVideoCommand, VideoItemModel>
{
    public async Task<VideoItemModel> Handle(CreateVideoCommand request, CancellationToken cancellationToken)
    {
        var entity = mapper.Map<VideoEntity>(request.Model);

        foreach (var genreId in request.Model.GenreIds.Distinct())
        {
            entity.VideoGenres.Add(new VideoGenreEntity
            {
                GenreId = genreId
            });
        }

        if (request.Model.Image != null)
            entity.Image = await imageService.SaveImageAsync(request.Model.Image);

        if (request.Model.Video != null)
            entity.Video = await videoFileService.SaveVideoAsync(request.Model.Video);

        await repo.AddAsync(entity);
        await repo.SaveChangesAsync();

        return mapper.Map<VideoItemModel>(entity);
    }
}
