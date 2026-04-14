using Application.Interfaces;
using Quartz;

namespace Infrastructure.Jobs;

[DisallowConcurrentExecution]
public class TagSeederJob(ISeederService seederService) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        var jsonPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Seeding", "Tags.json");
        await seederService.SeedTagsAsync(jsonPath);
    }
}