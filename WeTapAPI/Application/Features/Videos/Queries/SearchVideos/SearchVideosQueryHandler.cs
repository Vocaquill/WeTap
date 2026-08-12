using Application.Constants;
using Application.Interfaces;
using Application.Mappings;
using Application.Models.Search;
using Application.Models.Video;
using Domain;
using Domain.Entities.Video;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Videos.Queries.SearchVideos;

public class SearchVideosQueryHandler(
        IGenericRepository<VideoEntity, long> repo,
        VideoMappingProfile mapper,
        ICurrentUserService currentUser,
        AppDbContext context
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

        query = query.ForCurrentUser(currentUser);

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

        // ДОДАНО: Фільтрація для сторінки Liked Videos
        if (request.Model.IsLiked == true)
        {
            var currentUserId = currentUser.TryGetCurrentUserId();
            if (currentUserId.HasValue)
            {
                // Залишаємо тільки ті відео, які вподобав (IsLike == true) поточний користувач
                query = query.Where(x => x.VideoReactions.Any(r => r.UserId == currentUserId.Value && r.IsLike));
            }
            else
            {
                // Захист: якщо запит прийшов від неавторизованого гостя, повертаємо порожній список
                query = query.Where(x => false);
            }
        }

        int totalCount = await query.CountAsync();
        int totalPages = (int)Math.Ceiling(totalCount / (double)itemsPerPage);

        string? sortBy = request.Model.SortBy?.ToLower();

        if (sortBy == "date")
        {
            query = query.OrderByDescending(x => x.DateCreated);
        }
        else if (sortBy == "views")
        {
            query = query.OrderByDescending(x => x.ViewCount);
        }
        else if (sortBy == "likes" || sortBy == "rating" || sortBy == "reactions")
        {
            query = query.OrderByDescending(x => x.VideoReactions.Count(r => r.IsLike));
        }
        else
        {
            query = query.OrderByDescending(x => x.Id);
        }

        var items = await mapper.ProjectToItemModel(
            query
            .Skip((currentPage - 1) * itemsPerPage)
            .Take(itemsPerPage)
        ).ToListAsync();

        var videoIds = items.Select(x => x.Id).ToList();
        
        var reactions = await context.VideoReactions
            .Where(r => videoIds.Contains(r.VideoId))
            .GroupBy(r => r.VideoId)
            .Select(g => new
            {
                VideoId = g.Key,
                LikesCount = g.Count(r => r.IsLike),
                DislikesCount = g.Count(r => !r.IsLike)
            })
            .ToListAsync(cancellationToken);

        var userId = currentUser.TryGetCurrentUserId();
        var userReactions = userId.HasValue
            ? await context.VideoReactions
                .Where(r => videoIds.Contains(r.VideoId) && r.UserId == userId.Value)
                .ToDictionaryAsync(r => r.VideoId, r => r.IsLike, cancellationToken)
            : new Dictionary<long, bool>();

        foreach (var item in items)
        {
            var reaction = reactions.FirstOrDefault(r => r.VideoId == item.Id);
            if (reaction != null)
            {
                item.LikesCount = reaction.LikesCount;
                item.DislikesCount = reaction.DislikesCount;
            }
            else
            {
                item.LikesCount = 0;
                item.DislikesCount = 0;
            }

            if (userId.HasValue && userReactions.TryGetValue(item.Id, out var isLike))
            {
                item.IsLiked = isLike;
            }
        }

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