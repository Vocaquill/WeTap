using System.Security.Claims;
using Application.Features.Comments.Commands.CreateComment;
using Application.Features.Comments.Queries.GetCommentsReplies;
using Application.Features.Comments.Queries.GetVideoComments;
using Application.Models.Comments;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WeTapAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentsController(IMediator mediator) : ControllerBase
{
    [HttpGet("video/{videoId:long}")]
    [AllowAnonymous]
    public async Task<ActionResult<List<CommentsItemModal>>> GetByVideo(long videoId)
    {
        var result = await mediator.Send(new GetVideoCommentsQuery(videoId));
        return Ok(result);
    }

    [HttpGet("{parentId:long}/replies")]
    [AllowAnonymous]
    public async Task<ActionResult<List<CommentsItemModal>>> GetReplies(long parentId)
    {
        var result = await mediator.Send(new GetCommentRepliesQuery(parentId));
        return Ok(result);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<CommentsItemModal>> Create(
        [FromBody] CreateCommentRequest request)
    {
        var command = new CreateCommentCommand(
            request.Content,
            request.VideoId,
            request.ParentId
        );

        var result = await mediator.Send(command);
        return Ok(result);
    }
}

public record CreateCommentRequest(string Content, long VideoId, long? ParentId);