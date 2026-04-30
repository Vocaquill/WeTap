using Application.Models.Genre;
using MediatR;

namespace Application.Features.Genres.Commands.DeleteGenre;

public record DeleteGenreCommand(GenreDeleteModel Model)
    : IRequest;