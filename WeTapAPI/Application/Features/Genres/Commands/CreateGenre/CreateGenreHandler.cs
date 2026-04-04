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
        var entity = new GenreEntity
        {
            Name = request.Model.Name,
            Slug = request.Model.Slug
        };

        if (request.Model.Image != null)
        {
            entity.Image = await imageService.SaveImageAsync(request.Model.Image);
        }

        await repo.AddAsync(entity);
        await repo.SaveChangesAsync();

        return mapper.Map<GenreItemModel>(entity);
    }
}
