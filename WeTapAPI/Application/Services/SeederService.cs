using Application.Interfaces;
using Application.Models.Genre;
using AutoMapper;
using Domain;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace Application.Services;

public class SeederService(
    AppDbContext appDbContext, 
    ILogger<SeederService> logger,
    IMapper mapper) : ISeederService
{
    public async Task SeedGenresAsync(string jsonPath)
    {
        logger.LogInformation("GenreSeederJob started.");

        try
        {
            if (await appDbContext.Genres.AnyAsync())
            {
                logger.LogInformation("Genres already exist. Skipping seeding.");
                return;
            }

            if (!File.Exists(jsonPath))
            {
                logger.LogWarning("Genres.json not found at {Path}", jsonPath);
                return;
            }

            var json = await File.ReadAllTextAsync(jsonPath);
            var genresData = JsonSerializer.Deserialize<List<GenreSeedModel>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (genresData != null)
            {
                var genres = genresData.Select(g => mapper.Map<GenreEntity>(g)).ToList();

                await appDbContext.Genres.AddRangeAsync(genres);
                await appDbContext.SaveChangesAsync();
                logger.LogInformation("Successfully seeded {Count} genres.", genres.Count);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred during genre seeding.");
        }
    }

    public async Task UpdateDatabase()
    {
        await appDbContext.Database.MigrateAsync();
    }
}
