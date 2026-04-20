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
        if (request.Model.Id != null) 
        {
            var entity = await repo.GetByIdAsync(request.Model.Id.Value);

            model = mapper.Map<VideoItemModel>(entity);
        }
        else if (request.Model.Slug != null) 
        {
            var entity = await repo.AsQurable().Where(x => x.Slug == request.Model.Slug).FirstAsync();
            
            model = mapper.Map<VideoItemModel>(entity);
        }

        return model;
    }
}
