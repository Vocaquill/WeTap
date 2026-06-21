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
            Subject = "Password Reset",
            Body = $@"<!DOCTYPE html>
                    <html lang=""uk"">
                        <head>
                            <meta charset=""UTF-8"">
                            <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                            <title>Відновлення пароля</title>
                        </head>
                        <body style=""margin:0; padding:0; background-color:#000000; font-family:Arial,sans-serif; color:white;"">
                            <div style=""max-width:600px; margin:0 auto; padding:40px 20px; text-align:center;"">

                                <h1 style=""font-size:28px; font-weight:bold; text-transform:uppercase; margin-bottom:16px;"">
                                    Відновлення <span style=""color:#ef4444;"">пароля</span>
                                </h1>

                                <p style=""font-size:16px; color:#d1d5db; margin-bottom:32px;"">
                                    Ми отримали запит на відновлення пароля для вашого акаунта. Натисніть кнопку нижче, щоб створити новий пароль.
                                </p>

                                <a href=""{resetLink}"" 
                                   style=""background-color:#ef4444; color:white; font-weight:bold; text-transform:uppercase; padding:16px 32px; border-radius:12px; text-decoration:none; display:inline-block; font-size:16px;"">
                                    Reset Password
                                </a>

                                <p style=""font-size:12px; color:#9ca3af; margin-top:24px;"">
                                    Якщо ви не запитували відновлення пароля, просто ігноруйте цей лист.
                                </p>

                                <p style=""font-size:12px; color:#6b7280; margin-top:32px;"">
                                    © 2026 O.W.A.C.N. Всі права захищені.
                                </p>

                            </div>
                        </body>
                    </html>"
        };

        var result = await smtpService.SendEmailAsync(emailModel);

        return result;
    }
}
