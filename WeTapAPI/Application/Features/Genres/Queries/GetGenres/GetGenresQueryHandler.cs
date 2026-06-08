using Application.Interfaces;
using Application.Models.Genre;
using Application.Mappings;
using Domain.Entities.Genre;
using MediatR;

namespace Application.Features.Genres.Queries.GetGenres;

public class GetGenresQueryHandler(IGenericRepository<GenreEntity, long> repo, GenreMappingProfile genreMapper)
    : IRequestHandler<GetGenresQuery, IEnumerable<GenreItemModel>>
{
    public async Task<IEnumerable<GenreItemModel>> Handle(
        GetGenresQuery request,
        CancellationToken cancellationToken
    )
    {
        var genres = await repo.ListAllAsync();

        return genres.Select(genreMapper.MapToItemModel);
    }
}
