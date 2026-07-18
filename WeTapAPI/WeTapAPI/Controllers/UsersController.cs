using Application.Constants;
using Application.Features.Users.Commands.DeleteUser;
using Application.Features.Users.Commands.EditUser;
using Application.Features.Users.Queries.GetUserById;
using Application.Features.Users.Queries.GetUsers;
using Application.Features.Users.Queries.SearchUsers;
using Application.Models.Search;
using Application.Models.User;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WeTapAPI.Controllers;

[ApiController]
[Authorize(Roles = Roles.Admin)]
[Route("api/[controller]/[action]")]
public class UsersController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        var query = new GetUsersQuery();
        var result = await mediator.Send(query);

        return Ok(result);
    }

    [HttpGet]
    public async Task<ActionResult<SearchResult<UserItemModel>>> SearchUsers([FromQuery] UserSearchModel model)
    {
        var query = new SearchUsersQuery(model);
        var result = await mediator.Send(query);

        return Ok(result);
    }

    [HttpPut]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> EditUser([FromForm] UserEditModel model)
    {
        var command = new EditUserCommand(model);
        var result = await mediator.Send(command);

        return Ok(new { Token = result });
    }

    [HttpGet]
    public async Task<IActionResult> GetUserById(int id)
    {
        var query = new GetUserByIdQuery(id);
        var result = await mediator.Send(query);
        if (result == null)
        {
            return NotFound($"User with id: {id} not found");
        }

        return Ok(result);
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteUser([FromBody] UserDeleteModel model)
    {
        var command = new DeleteUserCommand(model.Id);
        await mediator.Send(command);

        return Ok();
    }
}
