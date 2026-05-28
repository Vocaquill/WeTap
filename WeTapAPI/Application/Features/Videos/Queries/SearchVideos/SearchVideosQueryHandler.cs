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
            .Where(x => !x.IsDeleted && x.Video != "processing...");

        if (!string.IsNullOrWhiteSpace(request.Model.Q))
        {
            string q = request.Model.Q.Trim().ToLower();
            query = query.Where(x =>
                x.Title.ToLower().Contains(q) ||
                x.Description.ToLower().Contains(q) ||
                (x.Channel != null && x.Channel.Name.ToLower().Contains(q)) ||
                (x.VideoTags != null && x.VideoTags.Any(vt => vt.Tag.Name.ToLower().Contains(q))) ||
                (x.VideoGenres != null && x.VideoGenres.Any(vt => vt.Genre.Name.ToLower().Contains(q)))
            );
        }

        if (!string.IsNullOrWhiteSpace(request.Model.Title))
        {
            string title = request.Model.Title.Trim().ToLower();
            query = query.Where(x => x.Title.ToLower().Contains(title));
        }

        if (!string.IsNullOrWhiteSpace(request.Model.ChannelName))
        {
            string channelName = request.Model.ChannelName.Trim().ToLower();
            query = query.Where(x => x.Channel != null && x.Channel.Name.ToLower().Contains(channelName));
        }

        if (request.Model.GenreId.HasValue)
        {
            query = query.Where(x =>
                x.VideoGenres != null && x.VideoGenres.Any(mg => mg.GenreId == request.Model.GenreId));
        }

        if (request.Model.TagId.HasValue)
        {
            query = query.Where(x =>
                x.VideoTags != null && x.VideoTags.Any(vt => vt.TagId == request.Model.TagId));
        }

        if (request.Model.ChannelId.HasValue)
        {
            query = query.Where(x => x.ChannelId == request.Model.ChannelId.Value);
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

        if (request.Model.SortBy == "date")
        {
            query = query.OrderByDescending(x => x.DateCreated);
        }
        else
        {
            query = query.OrderByDescending(x => x.Id);
        }

        var items = await query
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
