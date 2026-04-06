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
    IImageService imageService,
    AppDbContext context)
    : IRequestHandler<UpdateGenreCommand, GenreItemModel>
{
    public async Task<GenreItemModel> Handle(
        UpdateGenreCommand request, 
        CancellationToken cancellationToken)
    {
        long id = request.Model.Id;
        var genre = context.Genres.ToList().FirstOrDefault(x => x.Id == id);

        if (genre == null)
        {
            throw new Exception($"Genre with id {id} not found");
        }

        if (genre!.Image != null)
            await imageService.DeleteImageAsync(genre.Image);

        mapper.Map(request.Model, genre);

        if (request.Model.Image != null)
            genre.Image = await imageService.SaveImageAsync(request.Model.Image);

        await repo.UpdateAsync(genre);

        var returnedGenre = mapper.Map<GenreItemModel>(genre);

        return returnedGenre;
    }
}
