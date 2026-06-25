using Application.Interfaces;
using Application.Mappings;
using Application.Models.Tag;
using Domain;
using Domain.Entities.Tag;
using MediatR;

namespace Application.Features.Tags.Commands.UpdateTag;

public class UpdateTagHandler(IGenericRepository<TagEntity, long> repo, TagMappingProfile mapper, AppDbContext context)
    : IRequestHandler<UpdateTagCommand, TagItemModel>
{
    public async Task<TagItemModel> Handle(
        UpdateTagCommand request,
        CancellationToken cancellationToken)
    {
        var tag = context.Tags.First(x => x.Id == request.Model.Id && !x.IsDeleted);

        mapper.MapToEntity(request.Model, tag);

        await repo.UpdateAsync(tag);

        return mapper.MapToItemModel(tag);
    }
}