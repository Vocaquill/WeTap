using Application.Interfaces;
using Application.Models.Language;
using Application.Mappings;
using Domain.Entities.Language;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Languages.Queries.GetByLanguage;

public class GetByLanguageHandler(
    IGenericRepository<VideoLanguageEntity, long> repo,
    LanguageMappingProfile languageMapper
) : IRequestHandler<GetByLanguageQuery, LanguageItemModel?>
{
    public async Task<LanguageItemModel?> Handle(GetByLanguageQuery request, CancellationToken cancellationToken)
    {
        var query = repo.AsQurable()
            .AsNoTracking();

        VideoLanguageEntity? entity = null;

        if (request.Model.Id.HasValue)
        {
            entity = await query.FirstOrDefaultAsync(x => x.Id == request.Model.Id, cancellationToken);
        }
        else if (!string.IsNullOrWhiteSpace(request.Model.Slug))
        {
            entity = await query.FirstOrDefaultAsync(x => x.LanguageCode == request.Model.Slug, cancellationToken);
        }

        if (entity == null)
            throw new KeyNotFoundException("Мову не знайдено");

        return entity == null ? null : languageMapper.MapToItemModel(entity);
    }
}
