using Quartz;
using Quartz.Listener;

namespace Infrastructure.Jobs;

public class SeederOrchestratorListener : JobListenerSupport
{
    public override string Name => "SeederOrchestratorListener";

    private bool _tagSeeded = false;
    private bool _genreSeeded = false;
    private readonly object _syncLock = new();

    public override async Task JobWasExecuted(IJobExecutionContext context, JobExecutionException? jobException, CancellationToken cancellationToken = default)
    {
        var jobKey = context.JobDetail.Key.Name;

        if (jobKey == nameof(DbMigrationJob))
        {
            await context.Scheduler.TriggerJob(new JobKey(nameof(RoleSeederJob)), cancellationToken);
        }
        else if (jobKey == nameof(RoleSeederJob))
        {
            await context.Scheduler.TriggerJob(new JobKey(nameof(TagSeederJob)), cancellationToken);
            await context.Scheduler.TriggerJob(new JobKey(nameof(GenreSeederJob)), cancellationToken);
        }
        else if (jobKey == nameof(TagSeederJob) || jobKey == nameof(GenreSeederJob))
        {
            bool triggerVideo = false;

            lock (_syncLock)
            {
                if (jobKey == nameof(TagSeederJob)) _tagSeeded = true;
                if (jobKey == nameof(GenreSeederJob)) _genreSeeded = true;

                if (_tagSeeded && _genreSeeded)
                {
                    triggerVideo = true;
                }
            }

            if (triggerVideo)
            {
                // After both Tags and Genres are done, start Video seeder
                await context.Scheduler.TriggerJob(new JobKey(nameof(VideoSeederJob)), cancellationToken);
            }
        }
    }
}
