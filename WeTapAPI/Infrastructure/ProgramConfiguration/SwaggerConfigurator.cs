using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi;
using Scalar.AspNetCore;
using System.Threading.Tasks;

namespace Infrastructure.ProgramConfiguration;

public static class SwaggerConfigurator
{
    public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();

        services.AddOpenApi(options =>
        {

            options.AddOperationTransformer((operation, context, cancellationToken) =>
            {
                var metadata = context.Description.ActionDescriptor.EndpointMetadata;

                bool hasAllowAnonymous = metadata.OfType<IAllowAnonymous>().Any();
                bool hasAuthorize = metadata.OfType<IAuthorizeData>().Any();

                if (hasAuthorize && !hasAllowAnonymous)
                {
                    operation.Responses.TryAdd("401", new OpenApiResponse
                        { Description = "Unauthorized — valid JWT required" });
                    operation.Responses.TryAdd("403", new OpenApiResponse
                        { Description = "Forbidden — insufficient permissions" });

                    operation.Security =
                    [
                        new OpenApiSecurityRequirement
                        {
                            {
                                new OpenApiSecuritySchemeReference("Bearer"),
                                []
                            }
                        }
                    ];
                }

                if (context.Description.RelativePath?.Contains("Account/Login", StringComparison.OrdinalIgnoreCase) == true)
                {
                    operation.Summary = "Логін (повертає JWT)";
                    operation.Description =
                        "Цей запит **не** авторизує сесію в Scalar — лише повертає `token`. " +
                        "Скопіюй його в **Authenticate → Bearer**, потім виклич **GET /api/Account/Me**.";
                }

                return Task.CompletedTask;
            });
        });

        return services;
    }

    public static IApplicationBuilder UseSwaggerDocumentation(this IApplicationBuilder app)
    {
        app.UseSwaggerUI(options =>
        {
            options.RoutePrefix = "swagger";
            options.SwaggerEndpoint("/openapi/v1.json", "WeTap API v1");
            options.OAuthUsePkce();
            options.EnablePersistAuthorization();
        });

        if (app is IEndpointRouteBuilder endpoints)
        {
            endpoints.MapOpenApi();

            endpoints.MapScalarApiReference(options =>
            {
                options.WithTitle("WeTap API Documentation")
                       .WithTheme(ScalarTheme.Moon)
                       .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient)
                       .AddPreferredSecuritySchemes("Bearer");
            });
        }

        return app;
    }
}
