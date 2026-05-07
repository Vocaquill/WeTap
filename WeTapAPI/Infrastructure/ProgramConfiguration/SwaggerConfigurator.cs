using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi;
using Scalar.AspNetCore;
using System.Reflection;
using System.Threading.Tasks;

namespace Infrastructure.ProgramConfiguration;

public static class SwaggerConfigurator
{
    public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        
        services.AddOpenApi(options =>
        {
            options.AddDocumentTransformer((document, context, cancellationToken) =>
            {
                document.Components ??= new OpenApiComponents();
                document.Components.SecuritySchemes ??= new Dictionary<string, IOpenApiSecurityScheme>();

                document.Components.SecuritySchemes["Bearer"] = new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Name = "Authorization",
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\""
                };

                document.Security = [
                    new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecuritySchemeReference("Bearer"),
                        []
                    }
                }
                ];

                document.SetReferenceHostDocument();

                return Task.CompletedTask;
            });
        });

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
