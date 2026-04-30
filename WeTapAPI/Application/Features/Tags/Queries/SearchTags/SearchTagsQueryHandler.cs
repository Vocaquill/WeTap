using Application.Interfaces;
using Application.Models.Search;
using Application.Models.Tag;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities.Tag;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Tags.Queries.SearchTags;

public class SearchTagsQueryHandler(
        IGenericRepository<TagEntity, long> repo,
        IMapper mapper
    )
    : IRequestHandler<SearchTagsQuery, SearchResult<TagItemModel>>
{
    public async Task<SearchResult<TagItemModel>> Handle(SearchTagsQuery request, CancellationToken cancellationToken)
    {
        int currentPage = request.Model.Page < 1 ? 1 : request.Model.Page;
        int itemsPerPage = request.Model.ItemPerPage < 1 ? 10 : request.Model.ItemPerPage;

        IQueryable<TagEntity> query = repo.AsQurable()
            .AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.Model.Name))
        {
            string name = request.Model.Name.Trim().ToLower();
            query = query.Where(x => x.Name.ToLower().Contains(name));
        }

        int totalCount = await query.CountAsync();
        int totalPages = (int)Math.Ceiling(totalCount / (double)itemsPerPage);

        query = query.OrderByDescending(x => x.Id);

        var items = await query
            .Skip((currentPage - 1) * itemsPerPage)
            .Take(itemsPerPage)
            .ProjectTo<TagItemModel>(mapper.ConfigurationProvider)
            .ToListAsync();

        return new SearchResult<TagItemModel>
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
