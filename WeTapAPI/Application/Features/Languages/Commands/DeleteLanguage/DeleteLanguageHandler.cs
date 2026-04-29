using Application.Interfaces;
using Application.Models.Language;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities.Language;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Languages.Commands.DeleteLanguage;

public class DeleteLanguageHandler(IGenericRepository<VideoLanguageEntity, long> repo, IMapper mapper)
    : IRequestHandler<DeleteLanguageCommand>
{
    public async Task Handle(DeleteLanguageCommand request, CancellationToken cancellationToken)
    {
        var entity = await repo.AsQurable()
            .FirstOrDefaultAsync(x => x.Id == request.Model.Id, cancellationToken);

        if (entity == null)
        {
            throw new Exception($"Мову з Id {request.Model.Id} не знайдено.");
        }

        entity.IsDeleted = true;

        await repo.SaveChangesAsync();

    }
}
