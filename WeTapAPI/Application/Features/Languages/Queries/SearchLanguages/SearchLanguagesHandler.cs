using Application.Interfaces;
using Application.Models.Language;
using Application.Models.Search;
using Application.Mappings;
using Domain.Entities.Language;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Languages.Queries.SearchLanguages;

public class SearchLanguagesHandler(
    IGenericRepository<VideoLanguageEntity, long> repo,
    LanguageMappingProfile languageMapper
) : IRequestHandler<SearchLanguagesQuery, SearchResult<LanguageItemModel>>
{
    public async Task<SearchResult<LanguageItemModel>> Handle(SearchLanguagesQuery request, CancellationToken cancellationToken)
    {
        int currentPage = request.Model.Page < 1 ? 1 : request.Model.Page;
        int itemsPerPage = request.Model.ItemPerPage < 1 ? 10 : request.Model.ItemPerPage;

        IQueryable<VideoLanguageEntity> query = repo.AsQurable()
            .AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.Model.Name))
        {
            string name = request.Model.Name.Trim().ToLower();
            query = query.Where(x => x.Name.ToLower().Contains(name) || x.LanguageCode.ToLower().Contains(name));
        }

        int totalCount = await query.CountAsync(cancellationToken);
        int totalPages = (int)Math.Ceiling(totalCount / (double)itemsPerPage);

        query = query.OrderBy(x => x.Name);

        var pagedQuery = query
            .Skip((currentPage - 1) * itemsPerPage)
            .Take(itemsPerPage);

        var items = await languageMapper.ProjectToItemModel(pagedQuery)
            .ToListAsync(cancellationToken);

        return new SearchResult<LanguageItemModel>
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
