using MediatR;
using AutoMapper;
using Application.Models.Genre;
using Application.Interfaces;
using Domain.Entities.Genre;

namespace Application.Features.Genres.Commands.CreateGenre;

public class CreateGenreHandler(IGenericRepository<GenreEntity, long> repo, 
    IMapper mapper, 
    IImageService imageService)
    : IRequestHandler<CreateGenreCommand, GenreItemModel>
{
    public async Task<GenreItemModel> Handle(
        CreateGenreCommand request,
        CancellationToken cancellationToken)
    {
        var entity = mapper.Map<GenreEntity>(request.Model);

        if (request.Model.Image != null)
        {
            entity.Image = await imageService.SaveImageAsync(request.Model.Image);
        }

        await repo.AddAsync(entity);
        await repo.SaveChangesAsync();

        return mapper.Map<GenreItemModel>(entity);
    }
}
