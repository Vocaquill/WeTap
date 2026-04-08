using Application.Interfaces;
using Domain;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Quartz;
using System.Text.Json;

namespace Infrastructure.Jobs;

[DisallowConcurrentExecution]
public class GenreSeederJob(ISeederService seederService) : IJob
{

    public async Task Execute(IJobExecutionContext context)
    {
        await seederService.UpdateDatabase();
        var jsonPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Seeding", "Genres.json");
        await seederService.SeedGenresAsync(jsonPath);

        var videoJobKey = new JobKey("VideoSeederJob", "DEFAULT");
        if (await context.Scheduler.CheckExists(videoJobKey))
        {
            await context.Scheduler.TriggerJob(videoJobKey);
        }
    }
}
