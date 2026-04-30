using Domain;
using Domain.Entities.Identity;
using Infrastructure.Middlewares;
using Infrastructure.ProgramConfiguration;
using Hangfire;
using Application.Hubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Serilog;
using Serilog.Events;
using System.Text;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.WebHost.ConfigureKestrel(options =>
    {
        options.Limits.MaxRequestBodySize = null;
    });

    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowAll", policy =>
        {
            policy.SetIsOriginAllowed(_ => true)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
    });

    builder.Services.Configure<ApiBehaviorOptions>(options =>
    {
        options.SuppressModelStateInvalidFilter = true;
    });

    builder.Services.AddOpenApi(options =>
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

            /*
            document.Servers = new List<OpenApiServer>
            {
                new OpenApiServer
                {
                    Url = "https://counterwatch.itstep.click/api",
                    Description = "Production server"
                }
            };
            */
            return Task.CompletedTask;
        });
    });

    builder.Host.UseSerilog((context, services, configuration) => configuration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
    );

    builder.Services
    .AddIdentity<UserEntity, RoleEntity>(options =>
    {
        options.Password.RequiredLength = 6;
        options.Password.RequireDigit = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;
    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

    builder.Services.AddInfrastructureServices(builder.Configuration);
    builder.Services.AddSwaggerDocumentation();

    builder.Services.AddControllers();

    var app = builder.Build();

    // Метод конфігурації папок з рівня інфраструктури
    app.UseImagesDirectory(builder.Configuration);
    app.UseVideosDirectory(builder.Configuration);

    if (app.Environment.IsDevelopment())
    {
        app.UseSwaggerDocumentation();
    }

    app.UseMiddleware<GlobalExceptionHandlerMiddleware>();

    app.UseSerilogRequestLogging();

    app.UseCors("AllowAll");

    app.UseAuthorization();

    app.UseHangfireDashboard();

    app.MapControllers();
    app.MapHub<VideoProgressHub>("/videoProgressHub");

    app.Run();



}
catch (Exception ex) when (ex is not OperationCanceledException && ex.GetType().Name != "HostAbortedException")
{
    Log.Fatal(ex, "Application falied to start");
}
finally
{
    Log.CloseAndFlush();
}


