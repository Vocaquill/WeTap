using Application.Interfaces;
using Application.Models.Genre;
using Domain;
using Domain.Entities.Genre;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Genres.Commands.DeleteGenre;

public class DeleteGenreHandler(IGenericRepository<GenreEntity, long> repo)
    : IRequestHandler<DeleteGenreCommand>
{
    public async Task Handle(DeleteGenreCommand request, CancellationToken cancellationToken)
    {
        var genre = await repo.GetByIdAsync(request.Model.Id);

        //if (!string.IsNullOrEmpty(genre.Image))
        //    await imageService.DeleteImageAsync(genre.Image); -- можливо потрібно, а можливо і ні

        await repo.DeleteAsync(genre.Id);
    }
}
