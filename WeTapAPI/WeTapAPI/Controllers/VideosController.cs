using Application.Features.Videos.Queries.GetVideos;
using Application.Features.Videos.Commands.CreateVideo;
using Application.Interfaces;
using Application.Models.Genre;
using Application.Models.Video;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Application.Features.Videos.Commands.UpdateVideo;
using Application.Features.Videos.Commands.DeleteVideo;
using Application.Models.Search;
using Application.Features.Videos.Queries.SearchVideos;
using Application.Models.VideoProcessing;
using Application.Features.Videos.Queries.GetByVideo;

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
    [Consumes("multipart/form-data")]
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

    [HttpGet("get-by")]
    public async Task<ActionResult<VideoItemModel>> GetById([FromQuery] GetByModel model)
    {
        var query = new GetByVideoQuery(model);
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("search")]
    public async Task<ActionResult<SearchResult<VideoItemModel>>> Search([FromQuery] VideoSearchModel model)
    {
        var query = new SearchVideosQuery(model);
        var result = await mediator.Send(query);
        return Ok(result);
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<VideoProcessingResult>> Create([FromForm] VideoCreateModel model)
    {
        var command = new CreateVideoCommand(model);
        var result = await mediator.Send(command);
        return Ok(result);
    }

    [HttpPut]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<VideoProcessingResult>> Update([FromForm] VideoUpdateModel model)
    {
        var command = new UpdateVideoCommand(model);
        var result = await mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete]
    public async Task<ActionResult<IEnumerable<VideoItemModel>>> Delete([FromBody] VideoDeleteModel model)
    {
        var command = new DeleteVideoCommand(model);
        var result = await mediator.Send(command);
        return Ok(result);
    }
}
