using Application.Interfaces;
using Application.Models.Tag;
using AutoMapper;
using Domain;
using Domain.Entities.Tag;
using MediatR;

namespace Application.Features.Tags.Commands.UpdateTag;

public class UpdateTagHandler(IGenericRepository<TagEntity, long> repo, IMapper mapper, AppDbContext context)
    : IRequestHandler<UpdateTagCommand, TagItemModel>
{
    public async Task<TagItemModel> Handle(
        UpdateTagCommand request,
        CancellationToken cancellationToken)
    {
        var tag = context.Tags.FirstOrDefault(x => x.Id == request.Model.Id && !x.IsDeleted);

        if (tag == null)
            throw new Exception($"Tag with id {request.Model.Id} not found");

        mapper.Map(request.Model, tag);

        await repo.UpdateAsync(tag);

        return mapper.Map<TagItemModel>(tag);
    }
}