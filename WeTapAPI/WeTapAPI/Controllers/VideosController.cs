using Application.Interfaces;
using Application.Models.Genre;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace WeTapAPI.Controllers;

public class TestVideoSavingCommand : IRequest<GenreItemModel>
{
    public IFormFile File { get; set; }
}

[ApiController]
[Route("api/[controller]")]
public class VideosController(IMediator mediator, IVideoFileService videoFileService) : ControllerBase
{
    [HttpPost("TestVideoSaving")]
    public async Task<ActionResult<GenreItemModel>> Create([FromForm] TestVideoSavingCommand model)
    {
        var result = await videoFileService.SaveVideoAsync(model.File);
        return Ok(result);
    }
}
