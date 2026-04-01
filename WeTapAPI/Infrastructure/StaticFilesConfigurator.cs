using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileProviders;
using System.IO;

namespace Infrastructure;

public static class StaticFilesConfigurator
{
    public static IApplicationBuilder UseImagesDirectory(this IApplicationBuilder app, IConfiguration configuration)
    {
        var dir = configuration["ImagesDir"]!;
        var path = Path.Combine(Directory.GetCurrentDirectory(), dir);

        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
        }

        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(path),
            RequestPath = $"/{dir}"
        });

        return app;
    }
}