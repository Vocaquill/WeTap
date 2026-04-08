using Application.Features.Genres.Queries.GetGenres;
using Application.Interfaces;
using Application.Mappings;
using Application.Services;
using Domain;
using Infrastructure.Jobs;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Quartz;

namespace Infrastructure.ProgramConfiguration;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        //services
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
            var jobKey = new JobKey("GenreSeederJob");
            q.AddJob<GenreSeederJob>(opts => opts.WithIdentity(jobKey));
            q.AddTrigger(opts => opts
                .ForJob(jobKey)
                .WithIdentity("GenreSeederJob-trigger")
                .StartNow());
        });

        services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);

        return services;
    }
}
