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
    IMapper mapper,
    IImageService imageService) : ISeederService
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
            var genreTasks = genresData.Select(async g =>
            {
                GenreEntity entity = mapper.Map<GenreEntity>(g);
                if (!string.IsNullOrEmpty(g.ImagePath))
                    entity.Image = await imageService.SaveImageFromUrlAsync(g.ImagePath);

                return entity;
            });

            var genres = await Task.WhenAll(genreTasks);

            await appDbContext.Genres.AddRangeAsync(genres);
            await appDbContext.SaveChangesAsync();
        }
    }

    public async Task UpdateDatabase()
    {
        await appDbContext.Database.MigrateAsync();
    }
}
