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
    public async Task<ActionResult<List<CommentsItemModal>>> GetByVideo(long videoId)
    {
        var result = await mediator.Send(new GetVideoCommentsQuery(videoId));
        return Ok(result);
    }

    [HttpGet("{parentId:long}/replies")]
    public async Task<ActionResult<List<CommentsItemModal>>> GetReplies(long parentId)
    {
        var result = await mediator.Send(new GetCommentRepliesQuery(parentId));
        return Ok(result);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<CommentsItemModal>> Create(
        [FromBody] CreateCommentRequest request
    )
    {
        // Безпечно дістаємо ID користувача з токена
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !long.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var command = new CreateCommentCommand(
            request.Content,
            request.VideoId,
            request.ParentId,
            userId
        );

        var result = await mediator.Send(command);
        return Ok(result);
    }
}

// Об'єкт, який приходить від фронтенду
public record CreateCommentRequest(string Content, long VideoId, long? ParentId);
