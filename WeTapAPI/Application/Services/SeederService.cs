using Application.Interfaces;
using Application.Models.Genre;
using AutoMapper;
using Domain;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Application.Services;

public class SeederService(
    AppDbContext appDbContext,
    IMapper mapper) : ISeederService
{
    public async Task SeedGenresAsync(string jsonPath)
    {
        if (await appDbContext.Genres.AnyAsync())
            return;

        if (!File.Exists(jsonPath))
            throw new FileNotFoundException("Genres.json not found.", jsonPath);

        var json = await File.ReadAllTextAsync(jsonPath);
        var genresData = JsonSerializer.Deserialize<List<GenreSeedModel>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        if (genresData != null)
        {
            var genres = genresData.Select(g => mapper.Map<GenreEntity>(g)).ToList();

            await appDbContext.Genres.AddRangeAsync(genres);
            await appDbContext.SaveChangesAsync();
        }
    }

    public async Task UpdateDatabase()
    {
        await appDbContext.Database.MigrateAsync();
    }
}
