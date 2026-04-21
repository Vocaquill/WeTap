using Application.Interfaces;
using Quartz;

namespace Infrastructure.Jobs;

[DisallowConcurrentExecution]
public class LanguageSeederJob(ISeederService seederService) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        var jsonPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Seeding", "Languages.json");
        await seederService.SeedVideoLanguagesAsync(jsonPath);
    }
}
