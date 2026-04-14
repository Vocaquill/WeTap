using Application.Interfaces;
using Application.Models.Tag;
using AutoMapper;
using Domain.Entities.Tag;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Tags.Commands.DeleteTag;

public class DeleteTagHandler(IGenericRepository<TagEntity, long> repo, IMapper mapper)
    : IRequestHandler<DeleteTagCommand, IEnumerable<TagItemModel>>
{
    public async Task<IEnumerable<TagItemModel>> Handle(
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
            throw new Exception("Tag not found");
        }

        await repo.DeleteAsync(tag.Id);

        var entityList = await repo.ListAllAsync();
        return mapper.Map<IEnumerable<TagItemModel>>(entityList);
    }
}