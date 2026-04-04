using Application.Models.Genre;
using Application.Features.Genres.Commands.CreateGenre;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace WeTapAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GenresController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<GenreItemModel>> Create([FromForm] GenreCreateModel model)
    {
        var command = new CreateGenreCommand(model);
        var result = await mediator.Send(command);
        return Ok(result);
    }
}
