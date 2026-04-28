using Application.Features.Genres.Queries.GetGenres;
using Application.Interfaces;
using Application.Mappings;
using Application.Services;
using Domain;
using Infrastructure.Filters;
using Infrastructure.Jobs;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Quartz;
using FluentValidation;
using Application.Validators.Video;
using Microsoft.AspNetCore.Http.Features;

namespace Infrastructure.ProgramConfiguration;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        //services
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ISeederService, SeederService>();
        services.AddScoped<IImageService, ImageService>();
        services.AddScoped<IVideoFileService, VideoFileService>();
        services.AddScoped(typeof(IGenericRepository<,>), typeof(GenericRepository<,>));

        // DB
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString));

        // MediatR
        services.AddMediatR(cfg => {
            cfg.RegisterServicesFromAssembly(typeof(GetGenresQuery).Assembly);
        });

        // AutoMapper
        services.AddAutoMapper(cfg => {
            cfg.AddMaps(typeof(GetGenresQuery).Assembly);
        });

        // Quartz
        services.AddQuartz(q =>
        {
            q.AddJobListener<SeederOrchestratorListener>();

            var migrationJobKey = new JobKey(nameof(DbMigrationJob));
            q.AddJob<DbMigrationJob>(opts => opts.WithIdentity(migrationJobKey));
            q.AddTrigger(opts => opts
                .ForJob(migrationJobKey)
                .WithIdentity("DbMigrationJob-trigger")
                .StartNow());

            var roleJobKey = new JobKey(nameof(RoleSeederJob));
            q.AddJob<RoleSeederJob>(opts => opts.WithIdentity(roleJobKey).StoreDurably());

            var tagJobKey = new JobKey(nameof(TagSeederJob));
            q.AddJob<TagSeederJob>(opts => opts.WithIdentity(tagJobKey).StoreDurably());

            var genreJobKey = new JobKey(nameof(GenreSeederJob));
            q.AddJob<GenreSeederJob>(opts => opts.WithIdentity(genreJobKey).StoreDurably());

            var videoJobKey = new JobKey(nameof(VideoSeederJob));
            q.AddJob<VideoSeederJob>(opts => opts.WithIdentity(videoJobKey).StoreDurably());
        });

        services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);

        // FluentValidation
        services.AddValidatorsFromAssemblyContaining<VideoCreateModelValidator>();

        // MVC Filter and Options
        services.Configure<MvcOptions>(options =>
        {
            options.Filters.Add<ValidationFilter>();
        });

        services.Configure<ApiBehaviorOptions>(options =>
        {
            options.SuppressModelStateInvalidFilter = true;
        });

        services.Configure<FormOptions>(options =>
        {
            options.MultipartBodyLengthLimit = long.MaxValue;
            options.MultipartHeadersLengthLimit = int.MaxValue;
        });

        return services;
    }
}
