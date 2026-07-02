using Application.Constants;
using Application.Features.Studio.Queries.GetChannelCharts;
using Application.Features.Studio.Queries.GetChannelOverview;
using Application.Models.Statistics;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WeTapAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = $"{Roles.Author},{Roles.Admin}")]
public class StudioController(IMediator mediator) : ControllerBase
{
    [HttpGet("charts")]
    public async Task<ActionResult<IEnumerable<ChannelChartModel>>> GetCharts(
        [FromQuery] GetChannelChartsModel model)
    {
        var query = new GetChannelChartsQuery(model);
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("overview")]
    public async Task<ActionResult<ChannelStatisticsModel>> GetOverview(
        [FromQuery] long? channelId)
    {
        var query = new GetChannelOverviewQuery(channelId);
        var result = await mediator.Send(query);
        return Ok(result);
    }
}
