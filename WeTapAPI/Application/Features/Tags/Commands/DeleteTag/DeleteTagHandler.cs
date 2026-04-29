using Application.Interfaces;
using Application.Models.Tag;
using AutoMapper;
using Domain.Entities.Tag;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Tags.Commands.DeleteTag;

public class DeleteTagHandler(IGenericRepository<TagEntity, long> repo, IMapper mapper)
    : IRequestHandler<DeleteTagCommand>
{
    public async Task Handle(
        DeleteTagCommand request,
        CancellationToken cancellationToken)
    {
        TagEntity tag;

        try
        {
            tag = await repo.AsQurable().Where(x => x.Id == request.Model.Id && !x.IsDeleted).FirstAsync();
            if (tag == null)
                throw new Exception();
        }
        catch (Exception)
        {
            throw new Exception("Тег не знайдено");
        }

        await repo.DeleteAsync(tag.Id);
    }
}