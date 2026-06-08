using Application.Interfaces;
using Application.Models.Genre;
using Application.Models.Search;
using Application.Mappings;
using Domain.Entities.Genre;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Genres.Queries.SearchGenres;

public class SearchGenresQueryHandler(
        IGenericRepository<GenreEntity, long> repo,
        GenreMappingProfile genreMapper
    )
    : IRequestHandler<SearchGenresQuery, SearchResult<GenreItemModel>>
{
    public async Task<SearchResult<GenreItemModel>> Handle(SearchGenresQuery request, CancellationToken cancellationToken)
    {
        int currentPage = request.Model.Page < 1 ? 1 : request.Model.Page;
        int itemsPerPage = request.Model.ItemPerPage < 1 ? 10 : request.Model.ItemPerPage;

        IQueryable<GenreEntity> query = repo.AsQurable()
            .AsNoTracking()
            .Where(x => !x.IsDeleted);

        if (!string.IsNullOrWhiteSpace(request.Model.Q))
        {
            string q = request.Model.Q.Trim().ToLower();
            query = query.Where(x =>
                x.Name.ToLower().Contains(q) ||
                x.Slug.ToLower().Contains(q)
            );
        }

        if (!string.IsNullOrWhiteSpace(request.Model.Name))
        {
            string name = request.Model.Name.Trim().ToLower();
            query = query.Where(x => x.Name.ToLower().Contains(name));
        }

        if (!string.IsNullOrWhiteSpace(request.Model.Slug))
        {
            string slug = request.Model.Slug.Trim().ToLower();
            query = query.Where(x => x.Slug.ToLower().Contains(slug));
        }

        int totalCount = await query.CountAsync(cancellationToken);
        int totalPages = (int)Math.Ceiling(totalCount / (double)itemsPerPage);

        if (request.Model.SortBy == "name")
        {
            query = query.OrderBy(x => x.Name);
        }
        else if (request.Model.SortBy == "slug")
        {
            query = query.OrderBy(x => x.Slug);
        }
        else
        {
            query = query.OrderByDescending(x => x.Id);
        }

        var pagedQuery = query
            .Skip((currentPage - 1) * itemsPerPage)
            .Take(itemsPerPage);

        var items = await genreMapper.ProjectToItemModel(pagedQuery)
            .ToListAsync(cancellationToken);

        return new SearchResult<GenreItemModel>
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
