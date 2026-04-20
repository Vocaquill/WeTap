using Application.Constants;
using Application.Interfaces;
using Application.Models.Genre;
using Application.Models.Video;
using Application.Models.Tag;
using AutoMapper;
using Domain;
using Domain.Entities.Genre;
using Domain.Entities.Video;
using Domain.Entities.Tag;
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

                if (v.TagIds != null && v.TagIds.Count > 0)
                {
                    foreach (var tagId in v.TagIds)
                    {
                        entity.VideoTags.Add(new VideoTagEntity { TagId = tagId });
                    }
                }

                await appDbContext.Videos.AddAsync(entity);
            }

            await appDbContext.SaveChangesAsync();
        }
    }
    
    public async Task SeedTagsAsync(string jsonPath)
    {
        if (await appDbContext.Tags.AnyAsync(t => !t.IsDeleted))
            return;

        if (!File.Exists(jsonPath))
            throw new FileNotFoundException("Tags.json not found.", jsonPath);

        var json = await File.ReadAllTextAsync(jsonPath);
        var tagsData = JsonSerializer.Deserialize<List<TagSeedModel>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        if (tagsData != null)
        {
            var tags = tagsData.Select(t => mapper.Map<TagEntity>(t)).ToList();
            await appDbContext.Tags.AddRangeAsync(tags);
            await appDbContext.SaveChangesAsync();
        }
    }

    public async Task SeedVideoPrivaciesAsync()
    {
        if (await appDbContext.VideoPrivacies.AnyAsync())
            return;

        var privacies = new List<VideoPrivacyEntity>
        {
            new() { Name = "Публічне", SystemCode = VideoPrivacyConstants.Public },
            new() { Name = "Приватне", SystemCode = VideoPrivacyConstants.Private },
            new() { Name = "За посиланням", SystemCode = VideoPrivacyConstants.UrlOnly }
        };

        await appDbContext.VideoPrivacies.AddRangeAsync(privacies);
        await appDbContext.SaveChangesAsync();
    }

    public async Task UpdateDatabase()
    {
        await appDbContext.Database.MigrateAsync();
    }
}
