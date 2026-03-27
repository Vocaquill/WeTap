using Application.Models.Genre;
using MediatR;

namespace Application.Genres.Queries.GetGenres;

public record GetGenresQuery : IRequest<IEnumerable<GenreItemModel>>;
