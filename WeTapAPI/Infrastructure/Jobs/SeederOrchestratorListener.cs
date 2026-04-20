using Quartz;
using Quartz.Listener;

namespace Infrastructure.Jobs;

public class SeederOrchestratorListener : JobListenerSupport
{
    public override string Name => "SeederOrchestratorListener";

    private bool _tagSeeded = false;
    private bool _genreSeeded = false;
    private bool _privacySeeded = false;
    private readonly object _syncLock = new();

    public override async Task JobWasExecuted(IJobExecutionContext context, JobExecutionException? jobException, CancellationToken cancellationToken = default)
    {
        var jobKey = context.JobDetail.Key.Name;

        if (jobKey == nameof(DbMigrationJob))
        {
            // After migration, start Tag, Genre, and Privacy seeders in parallel
            await context.Scheduler.TriggerJob(new JobKey(nameof(TagSeederJob)), cancellationToken);
            await context.Scheduler.TriggerJob(new JobKey(nameof(GenreSeederJob)), cancellationToken);
            await context.Scheduler.TriggerJob(new JobKey(nameof(VideoPrivacySeederJob)), cancellationToken);
        }
        else if (jobKey == nameof(TagSeederJob) || jobKey == nameof(GenreSeederJob) || jobKey == nameof(VideoPrivacySeederJob))
        {
            bool triggerVideo = false;

            lock (_syncLock)
            {
                if (jobKey == nameof(TagSeederJob)) _tagSeeded = true;
                if (jobKey == nameof(GenreSeederJob)) _genreSeeded = true;
                if (jobKey == nameof(VideoPrivacySeederJob)) _privacySeeded = true;

                if (_tagSeeded && _genreSeeded && _privacySeeded)
                {
                    triggerVideo = true;
                }
            }

            if (triggerVideo)
            {
                // After Tags, Genres, and Privacy are done, start Video seeder
                await context.Scheduler.TriggerJob(new JobKey(nameof(VideoSeederJob)), cancellationToken);
            }
        }
    }
}
