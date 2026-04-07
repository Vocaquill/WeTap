using Application.Interfaces;
using Application.Models.Genre;
using AutoMapper;
using Domain;
using Domain.Entities.Genre;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Genres.Commands.DeleteGenre;

public class DeleteGenreHandler(IGenericRepository<GenreEntity, long> repo,
    IMapper mapper,
    IImageService imageService,
    AppDbContext context)
    : IRequestHandler<DeleteGenreCommand, IEnumerable<GenreItemModel>>
{
    public async Task<IEnumerable<GenreItemModel>> Handle(DeleteGenreCommand request, CancellationToken cancellationToken)
    {
        var genre = await context.Genres.Where(x => x.Id == request.Model.Id && !x.IsDeleted).FirstAsync();
        if (genre == null)
            throw new Exception("Genre not found");

        if (!string.IsNullOrEmpty(genre.Image))
            await imageService.DeleteImageAsync(genre.Image);

        await repo.DeleteAsync(genre.Id);

        var entityList = await repo.ListAllAsync();
        var modelList = mapper.Map<IEnumerable<GenreItemModel>>(entityList);

        return modelList;
    }
}
