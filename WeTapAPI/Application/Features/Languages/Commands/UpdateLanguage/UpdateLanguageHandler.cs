using Application.Interfaces;
using Application.Models.Language;
using AutoMapper;
using Domain.Entities.Language;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Languages.Commands.UpdateLanguage;

public class UpdateLanguageHandler(IGenericRepository<VideoLanguageEntity, long> repo, IMapper mapper)
    : IRequestHandler<UpdateLanguageCommand, LanguageItemModel>
{
    public async Task<LanguageItemModel> Handle(UpdateLanguageCommand request, CancellationToken cancellationToken)
    {
        var entity = await repo.AsQurable()
            .FirstOrDefaultAsync(x => x.Id == request.Model.Id, cancellationToken);

        if (entity == null)
            throw new Exception("Мову не знайдено");

        mapper.Map(request.Model, entity);

        await repo.SaveChangesAsync();

        return mapper.Map<LanguageItemModel>(entity);
    }
}
