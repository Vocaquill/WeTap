using Application.Features.Tags.Commands.CreateTag;
using Application.Features.Tags.Commands.DeleteTag;
using Application.Features.Tags.Commands.UpdateTag;
using Application.Features.Tags.Queries.GetTags;
using Application.Models.Tag;
using Application.Models.Search;
using Application.Features.Tags.Queries.SearchTags;
using Application.Features.Tags.Queries.GetByTag;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Application.Constants;

namespace WeTapAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TagsController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<TagItemModel>> Create([FromBody] TagCreateModel model)
    {
        var command = new CreateTagCommand(model);
        var result = await mediator.Send(command);
        return Ok(result);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<TagItemModel>>> GetAll()
    {
        var query = new GetTagsQuery();
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("search")]
    [AllowAnonymous]
    public async Task<ActionResult<SearchResult<TagItemModel>>> Search(
        [FromQuery] TagSearchModel model)
    {
        var query = new SearchTagsQuery(model);
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [HttpPut]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<TagItemModel>> Update([FromBody] TagUpdateModel model)
    {
        var command = new UpdateTagCommand(model);
        var result = await mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult> Delete([FromBody] TagDeleteModel model)
    {
        var command = new DeleteTagCommand(model);
        await mediator.Send(command);
        return Ok();
    }

    [HttpGet("get-by")]
    [AllowAnonymous]
    public async Task<ActionResult<TagItemModel>> GetBy([FromQuery] GetByModel model)
    {
        var query = new GetByTagQuery(model);
        var result = await mediator.Send(query);
        return Ok(result);
    }
}