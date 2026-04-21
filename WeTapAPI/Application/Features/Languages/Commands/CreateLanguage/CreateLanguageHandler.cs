using Application.Interfaces;
using Application.Models.Language;
using AutoMapper;
using Domain.Entities.Language;
using MediatR;

namespace Application.Features.Languages.Commands.CreateLanguage;

public class CreateLanguageHandler(IGenericRepository<VideoLanguageEntity, long> repo, IMapper mapper)
    : IRequestHandler<CreateLanguageCommand, LanguageItemModel>
{
    public async Task<LanguageItemModel> Handle(
        CreateLanguageCommand request,
        CancellationToken cancellationToken)
    {
        var entity = mapper.Map<VideoLanguageEntity>(request.Model);

        await repo.AddAsync(entity);
        await repo.SaveChangesAsync();

        return mapper.Map<LanguageItemModel>(entity);
    }
}
