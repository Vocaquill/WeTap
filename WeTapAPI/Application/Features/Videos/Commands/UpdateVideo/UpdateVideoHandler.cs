using Application.Interfaces;
using Application.Models.Video;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities.Video;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Videos.Commands.UpdateVideo;

public class UpdateVideoHandler(
    IGenericRepository<VideoEntity, long> repo,
    IMapper mapper,
    IImageService imageService,
    IVideoFileService videoFileService
) : IRequestHandler<UpdateVideoCommand, VideoItemModel>
{
    public async Task<VideoItemModel> Handle(UpdateVideoCommand request, CancellationToken cancellationToken)
    {
        var model = request.Model;

        var entity = await repo.AsQurable()
            .Include(x => x.VideoGenres)
            .FirstOrDefaultAsync(x => x.Id == model.Id && !x.IsDeleted, cancellationToken);

        if (entity == null)
            throw new Exception("Video not found");

        mapper.Map(model, entity);

        entity.VideoGenres.Clear();
        foreach (var genreId in model.GenreIds.Distinct())
        {
            entity.VideoGenres.Add(new VideoGenreEntity
            {
                GenreId = genreId
            });
        }

        if (model.Image != null)
        {
            if (entity.Image != null)
                await imageService.DeleteImageAsync(entity.Image);

            entity.Image = await imageService.SaveImageAsync(model.Image);
        }

        if (model.Video != null)
        {
            if (entity.Video != null)
                await videoFileService.DeleteVideoAsync(entity.Video);

            entity.Video = await videoFileService.SaveVideoAsync(model.Video);
        }

        await repo.SaveChangesAsync();

        return await repo.AsQurable()
            .Where(x => x.Id == entity.Id)
            .ProjectTo<VideoItemModel>(mapper.ConfigurationProvider)
            .FirstAsync(cancellationToken);
    }
}