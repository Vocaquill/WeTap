using Application.Features.Channel.Commands.CreateChannel;
using Application.Features.Channel.Commands.DeleteChannel;
using Application.Features.Channel.Commands.UpdateChannel;
using Application.Features.Channel.Queries.SearchChannels;
using Application.Models.Channel;
using Application.Models.Search;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WeTapAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChannelsController(IMediator mediator) : ControllerBase
{
    [HttpGet("search")]
    public async Task<ActionResult<SearchResult<ChannelItemModel>>> Search([FromQuery] ChannelSearchModel model)
    {
        var query = new SearchChannelsQuery(model);
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<ChannelItemModel>> Create([FromForm] ChannelCreateModel model)
    { 
        var command = new CreateChannelCommand(model);
        var result = await mediator.Send(command);
        return Ok(result);
    }

    [HttpPut]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<ChannelItemModel>> Update([FromForm] ChannelUpdateModel model)
    {
        var command = new UpdateChannelCommand(model);
        var result = await mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete]
    public async Task<IActionResult> Delete([FromBody] ChannelDeleteModel model)
    {
        var command = new DeleteChannelCommand(model);
        await mediator.Send(command);
        return Ok();
    }
}
