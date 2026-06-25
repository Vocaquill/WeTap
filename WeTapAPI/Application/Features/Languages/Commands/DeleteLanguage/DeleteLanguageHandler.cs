using Application.Interfaces;
using Application.Models.Language;
using Domain.Entities.Language;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Languages.Commands.DeleteLanguage;

public class DeleteLanguageHandler(IGenericRepository<VideoLanguageEntity, long> repo)
    : IRequestHandler<DeleteLanguageCommand>
{
    public async Task Handle(DeleteLanguageCommand request, CancellationToken cancellationToken)
    {
        var entity = await repo.AsQurable()
            .FirstOrDefaultAsync(x => x.Id == request.Model.Id, cancellationToken);

        entity.IsDeleted = true;

        await repo.SaveChangesAsync();

    }
}
