using Application.Models.Genre;
using MediatR;

namespace Application.Features.Genres.Commands.UpdateGenre;

public record UpdateGenreCommand(GenreUpdateModel Model)
    : IRequest<GenreItemModel>;
