using Application.Interfaces;
using Application.Models.Language;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities.Language;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Languages.Queries.SearchLanguages;

public class SearchLanguagesHandler(
    IGenericRepository<VideoLanguageEntity, long> repo,
    IMapper mapper
) : IRequestHandler<SearchLanguagesQuery, IEnumerable<LanguageItemModel>>
{
    public async Task<IEnumerable<LanguageItemModel>> Handle(SearchLanguagesQuery request, CancellationToken cancellationToken)
    {
        IQueryable<VideoLanguageEntity> query = repo.AsQurable()
            .AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.Model.Name))
        {
            string name = request.Model.Name.Trim().ToLower();
            query = query.Where(x => x.Name.ToLower().Contains(name));
        }

        return await query
            .OrderBy(x => x.Name)
            .Take(5)
            .ProjectTo<LanguageItemModel>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
