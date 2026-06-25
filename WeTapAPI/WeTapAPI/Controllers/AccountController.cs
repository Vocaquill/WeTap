using Application.Features.Accounts.Commands.ChangePassword;
using Application.Features.Accounts.Commands.ForgotPassword;
using Application.Features.Accounts.Commands.GoogleLogin;
using Application.Features.Accounts.Commands.Login;
using Application.Features.Accounts.Commands.Logout;
using Application.Features.Accounts.Commands.Register;
using Application.Features.Accounts.Commands.ResetPassword;
using Application.Features.Accounts.Queries.ValidateResetToken;
using Application.Features.Accounts.Commands.RefreshToken;
using Application.Models.Account;
using Application.Models.User;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Application.Features.Accounts.Commands.EditAccount;

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
            var token = await mediator.Send(command);

            return Ok(new { token });
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
            var token = await mediator.Send(command);

            return Ok(new { token });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> GoogleLogin([FromBody] AccountGoogleLoginRequestModel model)
    {
        var command = new GoogleLoginCommand(model);
        var token = await mediator.Send(command);

        return Ok(new { token });
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> ForgotPassword([FromBody] AccountForgotPasswordModel model)
    {
        try
        {
            var command = new ForgotPasswordCommand(model);
            var result = await mediator.Send(command);

            if (result)
                return Ok();

            return BadRequest(new { message = "Не вдалося надіслати лист для відновлення паролю" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword([FromBody] AccountResetPasswordModel model)
    {
        var command = new ResetPasswordCommand(model);
        await mediator.Send(command);

        return Ok();
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> ValidateResetToken([FromQuery] AccountValidateResetTokenModel model)
    {
        var query = new ValidateResetTokenQuery(model);
        var result = await mediator.Send(query);

        return Ok(new { IsValid = result });
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> ChangePassword([FromBody] AccountChangePasswordModel model)
    {
        var command = new ChangePasswordCommand(model);
        await mediator.Send(command);

        return Ok();
    }

    [Authorize]
    [HttpPut]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> EditAccount([FromForm] UserEditModel model)
    {
        var command = new EditAccountCommand(model);
        var result = await mediator.Send(command);

        return Ok(new { token = result });
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> RefreshToken()
    {
        try
        {
            var command = new RefreshTokenCommand();
            var token = await mediator.Send(command);

            return Ok(new { token });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Logout()
    {
        await mediator.Send(new LogoutCommand());
        return Ok();
    }
}
