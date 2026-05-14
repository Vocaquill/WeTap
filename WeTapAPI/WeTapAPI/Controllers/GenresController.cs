using Application.Models.Genre;
using Application.Features.Genres.Commands.CreateGenre;
using Application.Features.Genres.Queries.GetGenres;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Application.Features.Genres.Commands.UpdateGenre;
using Application.Features.Genres.Commands.DeleteGenre;
using Application.Models.Search;
using Application.Features.Genres.Queries.SearchGenres;
using Application.Features.Genres.Queries.GetByGenre;

namespace WeTapAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GenresController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    //[Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<GenreItemModel>> Create([FromForm] GenreCreateModel model)
    {
        var command = new CreateGenreCommand(model);
        var result = await mediator.Send(command);
        return Ok(result);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<GenreItemModel>>> GetAll()
    {
        var query = new GetGenresQuery();
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("search")]
    [AllowAnonymous]
    public async Task<ActionResult<SearchResult<GenreItemModel>>> Search(
        [FromQuery] GenreSearchModel model)
    {
        var query = new SearchGenresQuery(model);
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [HttpPut]
    //[Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<GenreItemModel>> Update([FromForm] GenreUpdateModel model)
    {
        var command = new UpdateGenreCommand(model);
        var result = await mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete]
    //[Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult> Delete([FromBody] GenreDeleteModel model)
    {
        var command = new DeleteGenreCommand(model);
        await mediator.Send(command);
        return Ok();
    }

    [HttpGet("get-by")]
    [AllowAnonymous]
    public async Task<ActionResult<GenreItemModel>> GetBy([FromQuery] GetByModel model)
    {
        var query = new GetByGenreQuery(model);
        var result = await mediator.Send(query);
        return Ok(result);
    }
}