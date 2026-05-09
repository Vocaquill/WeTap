using Application.Features.Languages.Commands.CreateLanguage;
using Application.Features.Languages.Commands.UpdateLanguage;
using Application.Features.Languages.Commands.DeleteLanguage;
using Application.Features.Languages.Queries.SearchLanguages;
using Application.Features.Languages.Queries.GetByLanguage;
using Application.Models.Search;
using Application.Models.Language;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WeTapAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LanguagesController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    //[Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<LanguageItemModel>> Create([FromBody] LanguageCreateModel model)
    {
        var command = new CreateLanguageCommand(model);
        var result = await mediator.Send(command);
        return Ok(result);
    }

    [HttpGet("search")]
    [AllowAnonymous]
    public async Task<ActionResult<SearchResult<LanguageItemModel>>> Search(
        [FromQuery] LanguageSearchModel model)
    {
        var query = new SearchLanguagesQuery(model);
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("get-by")]
    [AllowAnonymous]
    public async Task<ActionResult<LanguageItemModel>> GetBy([FromQuery] GetByModel model)
    {
        var query = new GetByLanguageQuery(model);
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [HttpPut]
    //[Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<LanguageItemModel>> Update([FromBody] LanguageUpdateModel model)
    {
        var command = new UpdateLanguageCommand(model);
        var result = await mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete]
    //[Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<IEnumerable<LanguageItemModel>>> Delete(
        [FromBody] LanguageDeleteModel model)
    {
        var command = new DeleteLanguageCommand(model);
        await mediator.Send(command);
        return Ok();
    }
}