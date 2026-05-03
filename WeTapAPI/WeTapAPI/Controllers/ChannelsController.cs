using Application.Features.Channel.Commands.CreateChannel;
using Application.Features.Channel.Commands.UpdateChannel;
using Application.Models.Channel;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WeTapAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChannelsController(IMediator mediator) : ControllerBase
{
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
}
