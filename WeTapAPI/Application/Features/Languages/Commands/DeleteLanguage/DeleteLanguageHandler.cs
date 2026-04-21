using Application.Interfaces;
using Application.Models.Language;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities.Language;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Languages.Commands.DeleteLanguage;

public class DeleteLanguageHandler(IGenericRepository<VideoLanguageEntity, long> repo, IMapper mapper)
    : IRequestHandler<DeleteLanguageCommand, IEnumerable<LanguageItemModel>>
{
    public async Task<IEnumerable<LanguageItemModel>> Handle(DeleteLanguageCommand request, CancellationToken cancellationToken)
    {
        var entities = await repo.AsQurable()
            .Where(x => request.Model.Ids.Contains(x.Id))
            .ToListAsync(cancellationToken);

        foreach (var entity in entities)
        {
            entity.IsDeleted = true;
        }

        await repo.SaveChangesAsync();

        return await repo.AsQurable()
            .AsNoTracking()
            .ProjectTo<LanguageItemModel>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
