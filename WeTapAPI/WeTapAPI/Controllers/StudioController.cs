using Application.Constants;
using Application.Features.Studio.Queries.GetChannelCharts;
using Application.Models.Statistics;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WeTapAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = Roles.Author)]
public class StudioController(IMediator mediator) : ControllerBase
{
    /// <summary>
    /// Returns timeseries chart data (views, subscribers, likes) for the given channel
    /// within the specified date range.
    /// </summary>
    [HttpGet("charts")]
    public async Task<ActionResult<IEnumerable<ChannelChartModel>>> GetCharts(
        [FromQuery] long channelId,
        [FromQuery] DateTime from,
        [FromQuery] DateTime to)
    {
        var query = new GetChannelChartsQuery(channelId, from, to);
        var result = await mediator.Send(query);
        return Ok(result);
    }
}
