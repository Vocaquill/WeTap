using Application.Models.Genre;
using Application.Models.Search;
using MediatR;

namespace Application.Features.Genres.Queries.GetByGenre;

public record GetByGenreQuery(GetByModel Model)
    : IRequest<GenreItemModel?>;
