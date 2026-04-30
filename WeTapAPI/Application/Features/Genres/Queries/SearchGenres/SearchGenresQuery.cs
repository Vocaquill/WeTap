using Application.Models.Genre;
using Application.Models.Search;
using MediatR;

namespace Application.Features.Genres.Queries.SearchGenres;

public record SearchGenresQuery(GenreSearchModel Model) : IRequest<SearchResult<GenreItemModel>>;
