using Application.Features.Tags.Commands.CreateTag;
using Application.Features.Tags.Commands.DeleteTag;
using Application.Features.Tags.Commands.UpdateTag;
using Application.Features.Tags.Queries.GetTags;
using Application.Models.Tag;
using Application.Models.Search;
using Application.Features.Tags.Queries.SearchTags;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace WeTapAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TagsController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<TagItemModel>> Create([FromBody] TagCreateModel model)
    {
        var command = new CreateTagCommand(model);
        var result = await mediator.Send(command);
        return Ok(result);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TagItemModel>>> GetAll()
    {
        var query = new GetTagsQuery();
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("search")]
    public async Task<ActionResult<SearchResult<TagItemModel>>> Search([FromQuery] TagSearchModel model)
    {
        var query = new SearchTagsQuery(model);
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [HttpPut]
    public async Task<ActionResult<TagItemModel>> Update([FromBody] TagUpdateModel model)
    {
        var command = new UpdateTagCommand(model);
        var result = await mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete]
    public async Task<ActionResult<IEnumerable<TagItemModel>>> Delete([FromBody] TagDeleteModel model)
    {
        var command = new DeleteTagCommand(model);
        var result = await mediator.Send(command);
        return Ok(result);
    }
}