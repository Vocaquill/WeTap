using Application.Interfaces;
using Application.Mappings;
using Application.Models.Tag;
using Domain.Entities.Tag;
using MediatR;

namespace Application.Features.Tags.Commands.CreateTag;

public class CreateTagHandler(IGenericRepository<TagEntity, long> repo, TagMappingProfile mapper)
    : IRequestHandler<CreateTagCommand, TagItemModel>
{
    public async Task<TagItemModel> Handle(
        CreateTagCommand request,
        CancellationToken cancellationToken)
    {
        var entity = mapper.MapToEntity(request.Model);

        await repo.AddAsync(entity);
        await repo.SaveChangesAsync();

        return mapper.MapToItemModel(entity);
    }
}