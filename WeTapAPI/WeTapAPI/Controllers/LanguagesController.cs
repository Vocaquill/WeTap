using Application.Features.Languages.Commands.CreateLanguage;
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
}
