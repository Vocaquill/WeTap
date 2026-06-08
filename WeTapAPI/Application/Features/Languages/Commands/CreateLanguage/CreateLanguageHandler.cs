using Application.Interfaces;
using Application.Models.Language;
using Application.Mappings;
using Domain.Entities.Language;
using MediatR;

namespace Application.Features.Languages.Commands.CreateLanguage;

public class CreateLanguageHandler(IGenericRepository<VideoLanguageEntity, long> repo, LanguageMappingProfile languageMapper)
    : IRequestHandler<CreateLanguageCommand, LanguageItemModel>
{
    public async Task<LanguageItemModel> Handle(
        CreateLanguageCommand request,
        CancellationToken cancellationToken)
    {
        var entity = languageMapper.MapToEntity(request.Model);

        await repo.AddAsync(entity);
        await repo.SaveChangesAsync();

        return languageMapper.MapToItemModel(entity);
    }
}
