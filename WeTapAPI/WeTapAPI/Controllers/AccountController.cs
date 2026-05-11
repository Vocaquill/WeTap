using Application.Features.Accounts.Commands.GoogleLogin;
using Application.Features.Accounts.Commands.Login;
using Application.Features.Accounts.Commands.Register;
using Application.Models.Account;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WeTapAPI.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class AccountController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] AccountLoginModel model)
    {
        try
        {
            var command = new LoginCommand(model);
            var result = await mediator.Send(command);

            return Ok(new { Token = result });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost]
    [AllowAnonymous]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Register([FromForm] AccountRegisterModel model)
    {
        try
        {
            var command = new RegisterCommand(model);
            var result = await mediator.Send(command);

            return Ok(new { Token = result });
        }
        catch (Exception ex)
        {
            return BadRequest(new {message = ex.Message});
        }
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> GoogleLogin([FromBody] AccountGoogleLoginRequestModel model)
    {
        var command = new GoogleLoginCommand(model);
        var result = await mediator.Send(command);

        return Ok(new { Token = result });
    }
}
