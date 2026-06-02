using Application.Constants;
using Application.Features.Videos.Queries.GetVideos;
using Application.Interfaces;
using Application.Models.Video;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities.Video;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Videos.Queries.GetByVideo;

public class GetByVideoQueryHandler(
    IGenericRepository<VideoEntity, long> repo,
    IMapper mapper,
    ICurrentUserService currentUser)
    : IRequestHandler<GetByVideoQuery, VideoItemModel>
{
    public async Task<VideoItemModel> Handle(GetByVideoQuery request, CancellationToken cancellationToken)
    {
        IQueryable<VideoEntity> query = repo.AsQurable().Where(x => !x.IsDeleted);

        if (request.Model.Id != null)
        {
            query = query.Where(x => x.Id == request.Model.Id.Value);
        }
        else if (!string.IsNullOrEmpty(request.Model.Slug))
        {
            query = query.Where(x => x.Slug == request.Model.Slug);
        }
        else
        {
            throw new Exception("Необхідно вказати Id або Slug");
        }

        query = query.ForCurrentUser(currentUser);

        var model = await query
            .ProjectTo<VideoItemModel>(mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken);

        if (model == null)
            throw new Exception("Відео не знайдено");

        return model;
    }
}