using MediatR;
using Application.Mappings;
using Application.Models.Genre;
using Application.Interfaces;
using Domain.Entities.Genre;

namespace Application.Features.Genres.Commands.CreateGenre;

public class CreateGenreHandler(IGenericRepository<GenreEntity, long> repo, 
    GenreMappingProfile genreMapper, 
    IImageService imageService)
    : IRequestHandler<CreateGenreCommand, GenreItemModel>
{
    public async Task<GenreItemModel> Handle(
        CreateGenreCommand request,
        CancellationToken cancellationToken)
    {
        var entity = genreMapper.MapToEntity(request.Model);

        if (request.Model.Image != null)
        {
            entity.Image = await imageService.SaveImageAsync(request.Model.Image);
        }

        await repo.AddAsync(entity);
        await repo.SaveChangesAsync();

        return genreMapper.MapToItemModel(entity);
    }
}
