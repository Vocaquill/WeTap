using Application.Constants;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using System;

namespace Application.Services;

public class CookieAuthService(IHttpContextAccessor httpContextAccessor) : ICookieAuthService
{
    public void SetAuthCookie(string token)
    {
        var httpContext = httpContextAccessor.HttpContext;
        if (httpContext == null) return;

        var cookieOptions = new CookieOptions
        {
            // Захищає куки від доступу через JavaScript (XSS-атаки).
            // Куки будуть надсилатися лише через HTTP(S) запити.
            HttpOnly = true,

            // Куки передаються лише через захищене HTTPS-з'єднання.
            // Примітка: В ASP.NET Core під час локальної розробки (Localhost) 
            // це працює навіть через звичайний HTTP.
            Secure = true,

            // Захист від CSRF-атак. Режим Lax означає, що куки надсилаються при безпечній 
            // навігації на ваш сайт (наприклад, при переході за посиланням з іншого ресурсу),
            // але блокуються при міжсайтових підзапитах (наприклад, завантаження зображень чи AJAX).
            SameSite = SameSiteMode.Lax,

            // Встановлює термін дії куки на 7 днів від поточного моменту в UTC.
            // Після цього браузер автоматично її видалить.
            Expires = DateTimeOffset.UtcNow.AddDays(7),

            // Вказує, що куки доступні для всього сайту (усіх його шляхів та підсторінок).
            Path = "/"
        };

        httpContext.Response.Cookies.Append(AuthConstants.AuthCookieName, token, cookieOptions);
    }

    public void ClearAuthCookie()
    {
        var httpContext = httpContextAccessor.HttpContext;
        if (httpContext == null) return;

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddDays(-1),
            Path = "/"
        };

        httpContext.Response.Cookies.Delete(AuthConstants.AuthCookieName, cookieOptions);
    }
}
