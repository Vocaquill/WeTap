using Application.Features.Genres.Commands.CreateGenre;
using Application.Interfaces;
using Application.Models.Genre;
using AutoMapper;
using Domain;
using Domain.Entities;
using Domain.Entities.Genre;
using MediatR;

namespace Application.Features.Genres.Commands.UpdateGenre;

public class UpdateGenreHandler(IGenericRepository<GenreEntity, long> repo,
    IMapper mapper,
    IImageService imageService)
    : IRequestHandler<UpdateGenreCommand, GenreItemModel>
{
    public async Task<GenreItemModel> Handle(
        UpdateGenreCommand request, 
        CancellationToken cancellationToken)
    {
        long id = request.Model.Id;
        var genre = await repo.GetByIdAsync(id);

        if (genre == null)
        {
            throw new Exception($"Жанр з id {id} не знайдено");
        }

        var oldImage = genre.Image;

        mapper.Map(request.Model, genre);

        if (request.Model.Image != null)
        {
            if (!string.IsNullOrEmpty(oldImage))
                await imageService.DeleteImageAsync(oldImage);

            genre.Image = await imageService.SaveImageAsync(request.Model.Image);
        }
        else
        {
            genre.Image = oldImage;
        }

        await repo.UpdateAsync(genre);

        var returnedGenre = mapper.Map<GenreItemModel>(genre);

        return returnedGenre;
    }
}
