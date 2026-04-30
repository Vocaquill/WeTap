using Application.Interfaces;
using Application.Models.Genre;
using AutoMapper;
using Domain;
using Domain.Entities.Genre;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Genres.Commands.DeleteGenre;

public class DeleteGenreHandler(IGenericRepository<GenreEntity, long> repo,
    IMapper mapper)
    : IRequestHandler<DeleteGenreCommand>
{
    public async Task Handle(DeleteGenreCommand request, CancellationToken cancellationToken)
    {
        GenreEntity genre;

        try
        {
            genre = await repo.AsQurable().Where(x => x.Id == request.Model.Id && !x.IsDeleted).FirstAsync();
            if (genre == null)
                throw new Exception();
        }
        catch (Exception)
        {
            throw new Exception("Genre not found");
        }

        //if (!string.IsNullOrEmpty(genre.Image))
        //    await imageService.DeleteImageAsync(genre.Image); -- можливо потрібно, а можливо і ні

        await repo.DeleteAsync(genre.Id);
    }
}
