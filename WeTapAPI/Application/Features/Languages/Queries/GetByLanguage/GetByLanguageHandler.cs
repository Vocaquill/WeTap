using Application.Interfaces;
using Application.Models.Language;
using AutoMapper;
using Domain.Entities.Language;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Languages.Queries.GetByLanguage;

public class GetByLanguageHandler(
    IGenericRepository<VideoLanguageEntity, long> repo,
    IMapper mapper
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
            // Language doesn't have slug, but for consistency with GetByModel we check LanguageCode if it's passed in Slug field?
            // User said: "Якшо у моделі нема slug, нічого страшного, далі юзай ту модельку, нічого нового не тре створювати"
            // So I'll just check LanguageCode if Slug is provided.
            entity = await query.FirstOrDefaultAsync(x => x.LanguageCode == request.Model.Slug, cancellationToken);
        }

        return entity == null ? null : mapper.Map<LanguageItemModel>(entity);
    }
}
