using Application.Interfaces;
using Application.Models.Tag;
using AutoMapper;
using Domain.Entities.Tag;
using MediatR;

namespace Application.Features.Tags.Commands.CreateTag;

public class CreateTagHandler(IGenericRepository<TagEntity, long> repo, IMapper mapper)
    : IRequestHandler<CreateTagCommand, TagItemModel>
{
    public async Task<TagItemModel> Handle(
        CreateTagCommand request,
        CancellationToken cancellationToken)
    {
        var entity = mapper.Map<TagEntity>(request.Model);

        await repo.AddAsync(entity);
        await repo.SaveChangesAsync();

        return mapper.Map<TagItemModel>(entity);
    }
}