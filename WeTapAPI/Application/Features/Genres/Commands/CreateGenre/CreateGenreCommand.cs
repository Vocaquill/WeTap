using MediatR;
using Application.Models.Genre;

namespace Application.Features.Genres.Commands.CreateGenre;

public record CreateGenreCommand(GenreCreateModel Model)
    : IRequest<GenreItemModel>;
