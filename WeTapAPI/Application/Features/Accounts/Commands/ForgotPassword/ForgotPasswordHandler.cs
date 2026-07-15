using Application.Interfaces;
using Application.SMTP;
using Domain.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Application.Features.Accounts.Commands.ForgotPassword;

public class ForgotPasswordHandler(UserManager<UserEntity> userManager,
    IConfiguration configuration,
    ISmtpService smtpService) : IRequestHandler<ForgotPasswordCommand, bool>
{
    public async Task<bool> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await userManager.Users.FirstOrDefaultAsync(x => x.Email == request.Model.Email);

        if (user == null)
        {
            throw new Exception("Користувача з такою поштою не знайдено");
        }

        if (user.IsDeleted)
        {
            throw new Exception("Цей користувач видалений. Будь ласка, зверніться в підтримку");
        }

        string token = await userManager.GeneratePasswordResetTokenAsync(user);
        var resetLink = $"{configuration["ClientUrl"]}/reset-password?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(request.Model.Email)}";

        var emailModel = new EmailMessage
        {
            To = request.Model.Email,
            Subject = "Відновлення пароля",
            Body = $@"
<!DOCTYPE html>
<html lang=""uk"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Відновлення пароля</title>
</head>

<body style=""margin:0;padding:0;background:#09090B;font-family:Arial,Helvetica,sans-serif;"">

<table role=""presentation"" cellpadding=""0"" cellspacing=""0"" width=""100%"" style=""background:#09090B;padding:40px 20px;"">
<tr>
<td align=""center"">

<table role=""presentation"" cellpadding=""0"" cellspacing=""0"" width=""600"" style=""max-width:600px;background:#18181B;border:1px solid #27272A;border-radius:20px;padding:48px 40px;"">

    <tr>
        <td align=""center"" style=""padding-bottom:12px;"">
            <span style=""
                display:inline-block;
                font-size:32px;
                font-weight:800;
                color:#FFFFFF;
                letter-spacing:1px;
            "">
                We<span style=""color:#EF4444;"">Tap</span>
            </span>
        </td>
    </tr>

    <tr>
        <td align=""center"" style=""
            color:#FFFFFF;
            font-size:30px;
            font-weight:bold;
            padding-bottom:18px;
        "">
            Відновлення пароля
        </td>
    </tr>

    <tr>
        <td align=""center"" style=""
            color:#A1A1AA;
            font-size:16px;
            line-height:28px;
            padding-bottom:35px;
        "">
            Ми отримали запит на відновлення пароля для вашого акаунта.<br>
            Натисніть кнопку нижче, щоб створити новий пароль.
        </td>
    </tr>

    <tr>
        <td align=""center"" style=""padding-bottom:35px;"">
            <a href=""{resetLink}""
               style=""
                    display:inline-block;
                    background:#EF4444;
                    color:#FFFFFF;
                    text-decoration:none;
                    font-size:16px;
                    font-weight:bold;
                    padding:16px 36px;
                    border-radius:14px;
               "">
                Створити новий пароль
            </a>
        </td>
    </tr>

    <tr>
        <td style=""
            border-top:1px solid #27272A;
            padding-top:28px;
            color:#71717A;
            font-size:13px;
            line-height:24px;
            text-align:center;
        "">
            Якщо ви не надсилали запит на відновлення пароля,
            просто проігноруйте цей лист.
            <br><br>
            © 2026 WeTap. Усі права захищені.
        </td>
    </tr>

</table>

</td>
</tr>
</table>

</body>
</html>"
        };

        var result = await smtpService.SendEmailAsync(emailModel);

        return result;
    }
}
