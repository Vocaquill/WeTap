using Quartz;
using Quartz.Listener;

namespace Infrastructure.Jobs;

public class SeederOrchestratorListener : JobListenerSupport
{
    public override string Name => "SeederOrchestratorListener";

    private bool _tagSeeded = false;
    private bool _genreSeeded = false;
    private bool _privacySeeded = false;
    private bool _languageSeeded = false;
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
            await context.Scheduler.TriggerJob(new JobKey(nameof(UserSeederJob)), cancellationToken);
            await context.Scheduler.TriggerJob(new JobKey(nameof(TagSeederJob)), cancellationToken);
            await context.Scheduler.TriggerJob(new JobKey(nameof(GenreSeederJob)), cancellationToken);
            await context.Scheduler.TriggerJob(new JobKey(nameof(VideoPrivacySeederJob)), cancellationToken);
            await context.Scheduler.TriggerJob(new JobKey(nameof(LanguageSeederJob)), cancellationToken);
        }
        else if (jobKey == nameof(TagSeederJob) || jobKey == nameof(GenreSeederJob) || jobKey == nameof(VideoPrivacySeederJob) || jobKey == nameof(LanguageSeederJob))
        {
            bool triggerVideo = false;

            lock (_syncLock)
            {
                if (jobKey == nameof(TagSeederJob)) _tagSeeded = true;
                if (jobKey == nameof(GenreSeederJob)) _genreSeeded = true;
                if (jobKey == nameof(VideoPrivacySeederJob)) _privacySeeded = true;
                if (jobKey == nameof(LanguageSeederJob)) _languageSeeded = true;

                if (_tagSeeded && _genreSeeded && _privacySeeded && _languageSeeded)
                {
                    triggerVideo = true;
                }
            }

            if (triggerVideo)
            {
                // After Tags, Genres, Privacy, and Languages are done, start Video seeder
                await context.Scheduler.TriggerJob(new JobKey(nameof(VideoSeederJob)), cancellationToken);
            }
        }
    }
}
