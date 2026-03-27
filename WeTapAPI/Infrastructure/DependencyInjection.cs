using Application.Genres.Queries.GetGenres;
using Application.Mappings;
using Domain;
using Infrastructure.Jobs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Quartz;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
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
                .StartNow()); // Execute once at startup
        });

        services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);

        return services;
    }
}
