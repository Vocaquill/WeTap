using Application.Models.Genre;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities.Genre;
using MediatR;

namespace Application.Features.Genres.Queries.GetGenres;

public class GetGenresQueryHandler(IGenericRepository<GenreEntity, long> repo, IMapper mapper) 
    : IRequestHandler<GetGenresQuery, IEnumerable<GenreItemModel>>
{
    public async Task<IEnumerable<GenreItemModel>> Handle(GetGenresQuery request, CancellationToken cancellationToken)
    {
        var genres = await repo.ListAllAsync();
            
        return mapper.Map<IEnumerable<GenreItemModel>>(genres);
    }
}
