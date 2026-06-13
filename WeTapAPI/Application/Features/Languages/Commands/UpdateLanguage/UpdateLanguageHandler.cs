using Application.Interfaces;
using Application.Models.Language;
using Application.Mappings;
using Domain.Entities.Language;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Languages.Commands.UpdateLanguage;

public class UpdateLanguageHandler(IGenericRepository<VideoLanguageEntity, long> repo, LanguageMappingProfile languageMapper)
    : IRequestHandler<UpdateLanguageCommand, LanguageItemModel>
{
    public async Task<LanguageItemModel> Handle(UpdateLanguageCommand request, CancellationToken cancellationToken)
    {
        var entity = await repo.AsQurable()
            .FirstOrDefaultAsync(x => x.Id == request.Model.Id, cancellationToken);

        languageMapper.MapToEntity(request.Model, entity);

        await repo.SaveChangesAsync();

        return languageMapper.MapToItemModel(entity);
    }
}
