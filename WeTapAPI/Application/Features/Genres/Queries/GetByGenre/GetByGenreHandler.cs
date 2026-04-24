using Application.Interfaces;
using Application.Models.Genre;
using AutoMapper;
using Domain.Entities.Genre;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Genres.Queries.GetByGenre;

public class GetByGenreHandler(
    IGenericRepository<GenreEntity, long> repo,
    IMapper mapper
) : IRequestHandler<GetByGenreQuery, GenreItemModel?>
{
    public async Task<GenreItemModel?> Handle(GetByGenreQuery request, CancellationToken cancellationToken)
    {
        var query = repo.AsQurable()
            .AsNoTracking()
            .Where(x => !x.IsDeleted);

        GenreEntity? entity = null;

        if (request.Model.Id.HasValue)
        {
            entity = await query.FirstOrDefaultAsync(x => x.Id == request.Model.Id, cancellationToken);
        }
        else if (!string.IsNullOrWhiteSpace(request.Model.Slug))
        {
            entity = await query.FirstOrDefaultAsync(x => x.Slug == request.Model.Slug, cancellationToken);
        }

        if(entity == null)
            throw new KeyNotFoundException("Genre not found");

        return entity == null ? null : mapper.Map<GenreItemModel>(entity);
    }
}
