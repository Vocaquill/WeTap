using Application.Interfaces;
using Application.Models.Genre;
using Application.Models.Video;
using AutoMapper;
using Domain;
using Domain.Entities.Genre;
using Domain.Entities.Video;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Application.Services;

public class SeederService(
    AppDbContext appDbContext,
    IMapper mapper,
    IImageService imageService,
    IVideoFileService videoFileService) : ISeederService
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

    public async Task SeedVideosAsync(string jsonPath, string videosFolder)
    {
        if (await appDbContext.Videos.AnyAsync())
            return;

        if (!File.Exists(jsonPath))
            throw new FileNotFoundException("Videos.json not found.", jsonPath);

        var json = await File.ReadAllTextAsync(jsonPath);
        var videosData = JsonSerializer.Deserialize<List<VideoSeedModel>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        if (videosData != null)
        {
            foreach (var v in videosData)
            {
                var entity = mapper.Map<VideoEntity>(v);

                if (!string.IsNullOrEmpty(v.ImagePath))
                    entity.Image = await imageService.SaveImageFromUrlAsync(v.ImagePath);

                if (!string.IsNullOrEmpty(v.VideoFile))
                {
                    var videoPath = Path.Combine(videosFolder, v.VideoFile);
                    if (File.Exists(videoPath))
                    {
                        entity.Video = await videoFileService.SaveVideoFromFilePathAsync(videoPath);
                    }
                }

                if (v.GenreIds != null && v.GenreIds.Count > 0)
                {
                    foreach (var genreId in v.GenreIds)
                    {
                        entity.VideoGenres.Add(new VideoGenreEntity { GenreId = genreId });
                    }
                }

                await appDbContext.Videos.AddAsync(entity);
            }

            await appDbContext.SaveChangesAsync();
        }
    }

    public async Task UpdateDatabase()
    {
        await appDbContext.Database.MigrateAsync();
    }
}
