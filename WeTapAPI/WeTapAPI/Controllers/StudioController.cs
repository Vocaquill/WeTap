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
[Authorize(Roles = Roles.Admin)]
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
}
