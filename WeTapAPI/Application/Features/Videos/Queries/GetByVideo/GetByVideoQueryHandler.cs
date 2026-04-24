using Application.Features.Videos.Queries.GetVideos;
using Application.Interfaces;
using Application.Models.Video;
using AutoMapper;
using Domain.Entities.Video;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Videos.Queries.GetByVideo;

public class GetByVideoQueryHandler(IGenericRepository<VideoEntity, long> repo, IMapper mapper)
    : IRequestHandler<GetByVideoQuery, VideoItemModel>
{
    public async Task<VideoItemModel> Handle(GetByVideoQuery request, CancellationToken cancellationToken)
    {
        VideoItemModel model = new VideoItemModel();
        VideoEntity? entity = null;
        IQueryable<VideoEntity> query = repo.AsQurable()
            .Include(x => x.Privacy)
            .Include(x => x.VideoGenres!)
                .ThenInclude(x => x.Genre)
            .Include(x => x.VideoTags!)
                .ThenInclude(x => x.Tag);

        if (request.Model.Id != null) 
        {
            entity = await query.FirstOrDefaultAsync(x => x.Id == request.Model.Id.Value);

            if (entity == null)
                throw new Exception($"Відео з id {request.Model.Id.Value} не знайдено");

            model = mapper.Map<VideoItemModel>(entity);
        }
        else if (request.Model.Slug != null) 
        {
            entity = await query.FirstOrDefaultAsync(x => x.Slug == request.Model.Slug);

            if (entity == null)
                throw new Exception($"Відео з slug {request.Model.Slug} не знайдено");

            model = mapper.Map<VideoItemModel>(entity);
        }

        if (entity == null)
            throw new Exception("Відео не знайдено");

        entity.ViewCount++;
        await repo.UpdateAsync(entity);

        return model;
    }
}
