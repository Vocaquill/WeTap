using Domain;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Quartz;
using System.Text.Json;

namespace Infrastructure.Jobs;

[DisallowConcurrentExecution]
public class GenreSeederJob : IJob
{
    private readonly AppDbContext _context;
    private readonly ILogger<GenreSeederJob> _logger;

    public GenreSeederJob(AppDbContext context, ILogger<GenreSeederJob> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task Execute(IJobExecutionContext context)
    {
        _logger.LogInformation("GenreSeederJob started.");

        try
        {
            if (await _context.Genres.AnyAsync())
            {
                _logger.LogInformation("Genres already exist. Skipping seeding.");
                return;
            }

            var jsonPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Seeding", "Genres.json");
            if (!File.Exists(jsonPath))
            {
                _logger.LogWarning("Genres.json not found at {Path}", jsonPath);
                return;
            }

            var json = await File.ReadAllTextAsync(jsonPath);
            var genresData = JsonSerializer.Deserialize<List<GenreSeedModel>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (genresData != null)
            {
                var genres = genresData.Select(g => new GenreEntity
                {
                    Name = g.Name,
                    Slug = g.Slug,
                    Image = g.ImagePath
                }).ToList();

                await _context.Genres.AddRangeAsync(genres);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Successfully seeded {Count} genres.", genres.Count);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred during genre seeding.");
        }
    }

    private class GenreSeedModel
    {
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? ImagePath { get; set; }
    }
}
