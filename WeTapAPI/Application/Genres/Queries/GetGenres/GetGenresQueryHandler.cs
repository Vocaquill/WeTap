using Application.Models.Genre;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Genres.Queries.GetGenres;

public class GetGenresQueryHandler : IRequestHandler<GetGenresQuery, IEnumerable<GenreItemModel>>
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public GetGenresQueryHandler(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<GenreItemModel>> Handle(GetGenresQuery request, CancellationToken cancellationToken)
    {
        var genres = await _context.Genres
            .AsNoTracking()
            .ToListAsync(cancellationToken);
            
        return _mapper.Map<IEnumerable<GenreItemModel>>(genres);
    }
}
