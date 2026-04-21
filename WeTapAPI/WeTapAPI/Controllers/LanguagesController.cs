using Application.Features.Languages.Commands.CreateLanguage;
using Application.Features.Languages.Queries.SearchLanguages;
using Application.Features.Languages.Queries.GetByLanguage;
using Application.Models.Search;
using Application.Models.Language;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace WeTapAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LanguagesController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<LanguageItemModel>> Create([FromBody] LanguageCreateModel model)
    {
        var command = new CreateLanguageCommand(model);
        var result = await mediator.Send(command);
        return Ok(result);
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<LanguageItemModel>>> Search([FromQuery] LanguageSearchModel model)
    {
        var query = new SearchLanguagesQuery(model);
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("get-by")]
    public async Task<ActionResult<LanguageItemModel>> GetBy([FromQuery] GetByModel model)
    {
        var query = new GetByLanguageQuery(model);
        var result = await mediator.Send(query);
        return Ok(result);
    }
}
