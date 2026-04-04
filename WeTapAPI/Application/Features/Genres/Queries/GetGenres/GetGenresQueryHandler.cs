using Application.Models.Genre;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Genres.Queries.GetGenres;

public class GetGenresQueryHandler(AppDbContext context, IMapper mapper) : IRequestHandler<GetGenresQuery, IEnumerable<GenreItemModel>>
{
    public async Task<IEnumerable<GenreItemModel>> Handle(GetGenresQuery request, CancellationToken cancellationToken)
    {
        var genres = await context.Genres
            .AsNoTracking()
            .ToListAsync(cancellationToken);
            
        return mapper.Map<IEnumerable<GenreItemModel>>(genres);
    }
}
