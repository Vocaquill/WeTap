using Application.Models.Genre;
using MediatR;

namespace Application.Features.Genres.Queries.GetGenres;

public record GetGenresQuery : IRequest<IEnumerable<GenreItemModel>>;
