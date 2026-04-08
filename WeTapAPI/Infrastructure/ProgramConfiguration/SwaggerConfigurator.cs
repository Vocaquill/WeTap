using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Scalar.AspNetCore;
using Swashbuckle.AspNetCore.SwaggerGen;
using Swashbuckle.AspNetCore.SwaggerUI;
using System.Reflection;

namespace Infrastructure.ProgramConfiguration;

public static class SwaggerConfigurator
{
    public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddOpenApi(); // Сучасний OpenAPI двигун для .NET 9/10
        services.AddSwaggerGen(options =>
        {
            // Додаємо підтримку XML коментарів для класичного Swagger
            var assemblyName = Assembly.GetEntryAssembly()?.GetName().Name;
            if (assemblyName != null)
            {
                var xmlFile = $"{assemblyName}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                if (File.Exists(xmlPath))
                    options.IncludeXmlComments(xmlPath);
            }
        });

        return services;
    }

    public static IApplicationBuilder UseSwaggerDocumentation(this IApplicationBuilder app)
    {
        // 3. Класичний Swagger UI (доступний за /swagger)
        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "WeTap API v1");
            options.RoutePrefix = "swagger"; // Включаємо /swagger
        });

        // Mapping endpoints
        if (app is IEndpointRouteBuilder endpoints)
        {
            // 1. Стандартний OpenAPI JSON
            endpoints.MapOpenApi();

            // 2. Сучасний інтерфейс Scalar (доступний за /scalar/v1)
            endpoints.MapScalarApiReference(options =>
            {
                options.WithTitle("WeTap API Documentation")
                       .WithTheme(ScalarTheme.Moon)
                       .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient);
            });
        }

        return app;
    }
}
