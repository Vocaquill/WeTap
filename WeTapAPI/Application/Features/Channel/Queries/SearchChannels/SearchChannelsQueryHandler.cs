using Application.Interfaces;
using Application.Models.Channel;
using Application.Models.Search;
using Application.Mappings;
using Domain;
using Domain.Entities.Channel;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Channel.Queries.SearchChannels;

public class SearchChannelsQueryHandler(
        IGenericRepository<ChannelEntity, long> repo,
        ChannelMappingProfile channelMapper,
        AppDbContext context,
        ICurrentUserService currentUserService
    )
    : IRequestHandler<SearchChannelsQuery, SearchResult<ChannelItemModel>>
{
    public async Task<SearchResult<ChannelItemModel>> Handle(SearchChannelsQuery request, CancellationToken cancellationToken)
    {
        int currentPage = request.Model.Page < 1 ? 1 : request.Model.Page;
        int itemsPerPage = request.Model.ItemPerPage < 1 ? 10 : request.Model.ItemPerPage;

        IQueryable<ChannelEntity> query = repo.AsQurable()
            .AsNoTracking()
            .Where(x => !x.IsDeleted);

        if (!string.IsNullOrWhiteSpace(request.Model.Q))
        {
            string q = request.Model.Q.Trim().ToLower();
            query = query.Where(x =>
                x.Name.ToLower().Contains(q) ||
                x.NickName.ToLower().Contains(q) ||
                x.Description.ToLower().Contains(q)
            );
        }

        if (request.Model.IsSubscribed == true)
        {
            long? userId = currentUserService.TryGetCurrentUserId();
            if (userId.HasValue)
            {
                var subscribedIds = context.ChannelSubscribers
                    .Where(s => s.UserId == userId.Value)
                    .Select(s => s.ChannelId);

                query = query.Where(x => subscribedIds.Contains(x.Id));
            }
            else
            {
                return new SearchResult<ChannelItemModel>
                {
                    Items = new List<ChannelItemModel>(),
                    Pagination = new PaginationModel
                    {
                        TotalCount = 0,
                        TotalPages = 0,
                        ItemsPerPage = itemsPerPage,
                        CurrentPage = currentPage
                    }
                };
            }
        }

        int totalCount = await query.CountAsync(cancellationToken);
        int totalPages = (int)Math.Ceiling(totalCount / (double)itemsPerPage);

        var pagedQuery = query
            .OrderByDescending(x => x.Id)
            .Skip((currentPage - 1) * itemsPerPage)
            .Take(itemsPerPage);

        var items = await channelMapper.ProjectToItemModel(pagedQuery)
            .ToListAsync(cancellationToken);

        return new SearchResult<ChannelItemModel>
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
