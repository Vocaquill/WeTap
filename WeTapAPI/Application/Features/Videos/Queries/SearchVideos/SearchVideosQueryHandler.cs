using Application.Interfaces;
using Application.Models.Search;
using Application.Models.Video;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities.Video;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Videos.Queries.SearchVideos;

public class SearchVideosQueryHandler(
        IGenericRepository<VideoEntity, long> repo,
        IMapper mapper
    )
    : IRequestHandler<SearchVideosQuery, SearchResult<VideoItemModel>>
{
    public async Task<SearchResult<VideoItemModel>> Handle(SearchVideosQuery request, CancellationToken cancellationToken)
    {
        int currentPage = request.Model.Page < 1 ? 1 : request.Model.Page;
        int itemsPerPage = request.Model.ItemPerPage < 1 ? 10 : request.Model.ItemPerPage;

        IQueryable<VideoEntity> query = repo.AsQurable()
            .AsNoTracking()
            .Where(x => !x.IsDeleted);

        if (!string.IsNullOrWhiteSpace(request.Model.Title))
        {
            string title = request.Model.Title.Trim();
            query = query.Where(x => x.Title.Contains(title));
        }

        if (request.Model.GenreId.HasValue)
        {
            query = query.Where(x =>
                x.VideoGenres.Any(mg => mg.GenreId == request.Model.GenreId));
        }

        if (int.TryParse(request.Model.CreateYearFrom, out int fromYear))
        {
            query = query.Where(x => x.DateCreated.Year >= fromYear);
        }

        if (int.TryParse(request.Model.CreateYearTo, out int toYear))
        {
            query = query.Where(x => x.DateCreated.Year <= toYear);
        }

        int totalCount = await query.CountAsync();
        int totalPages = (int)Math.Ceiling(totalCount / (double)itemsPerPage);

        var items = await query
            .OrderByDescending(x => x.Id)
            .Skip((currentPage - 1) * itemsPerPage)
            .Take(itemsPerPage)
            .ProjectTo<VideoItemModel>(mapper.ConfigurationProvider)
            .ToListAsync();

        return new SearchResult<VideoItemModel>
        {
            Items = items,
            Pagination = new PaginationModel
            {
                TotalCount = totalCount,
                TotalPages = totalPages,
                ItemsPerPage = itemsPerPage,
                CurrentPage = currentPage
            }
        };
    }
}
