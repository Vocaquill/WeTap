using Application.Features.Videos.Queries.GetVideos;
using Application.Features.Videos.Commands.CreateVideo;
using Application.Interfaces;
using Application.Models.Genre;
using Application.Models.Video;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Application.Features.Videos.Commands.UpdateVideo;

namespace WeTapAPI.Controllers;

public class TestVideoSavingCommand : IRequest
{
    public IFormFile File { get; set; }
}

[ApiController]
[Route("api/[controller]")]
public class VideosController(IMediator mediator, IVideoFileService videoFileService) : ControllerBase
{
    [HttpPost("TestVideoSaving")] // для тесту
    public async Task<ActionResult<string>> Create([FromForm] TestVideoSavingCommand model)
    {
        var result = await videoFileService.SaveVideoAsync(model.File);
        return Ok(result);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<VideoItemModel>>> GetAll()
    {
        var query = new GetVideosQuery();
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<VideoItemModel>> Create([FromForm] VideoCreateModel model)
    {
        var command = new CreateVideoCommand(model);
        var result = await mediator.Send(command);
        return Ok(result);
    }

    [HttpPut]
    public async Task<ActionResult<VideoItemModel>> Update([FromForm] VideoUpdateModel model)
    {
        var command = new UpdateVideoCommand(model);
        var result = await mediator.Send(command);
        return Ok(result);
    }
}
