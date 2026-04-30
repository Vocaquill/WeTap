using Application.Constants;
using Application.Interfaces;
using Application.Models.Genre;
using Application.Models.Tag;
using Application.Models.Video;
using AutoMapper;
using Domain;
using Domain.Entities.Genre;
using Domain.Entities.Identity;
using Domain.Entities.Tag;
using Domain.Entities.Language;
using Application.Models.Language;
using Domain.Entities.Video;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Application.Services;

public class SeederService(
    AppDbContext appDbContext,
    RoleManager<RoleEntity> roleManager,
    IMapper mapper,
    IImageService imageService,
    IVideoFileService videoFileService) : ISeederService
{
    public async Task SeedGenresAsync(string jsonPath)
    {
        if (await appDbContext.Genres.AnyAsync())
            return;

        if (!File.Exists(jsonPath))
            throw new FileNotFoundException("Файл Genres.json не знайдено.", jsonPath);

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
        if (!File.Exists(jsonPath))
            throw new FileNotFoundException("Файл Videos.json не знайдено.", jsonPath);

        var json = await File.ReadAllTextAsync(jsonPath);
        var videosData = JsonSerializer.Deserialize<List<VideoSeedModel>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        if (videosData != null)
        {
            var privacies = await appDbContext.VideoPrivacies.ToListAsync();
            var publicPrivacy = privacies.FirstOrDefault(p => p.SystemCode == VideoPrivacyConstants.Public);

            foreach (var v in videosData)
            {
                if (await appDbContext.Videos.AnyAsync(vid => vid.Slug == v.Slug))
                    continue;

                var entity = mapper.Map<VideoEntity>(v);

                var privacy = privacies.FirstOrDefault(p => p.SystemCode == v.PrivacySystemCode) ?? publicPrivacy;
                if (privacy != null)
                {
                    entity.PrivacyId = privacy.Id;
                }

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

                if (!string.IsNullOrEmpty(v.LanguageCode))
                {
                    var language = await appDbContext.VideoLanguages.FirstOrDefaultAsync(l => l.LanguageCode == v.LanguageCode);
                    if (language != null)
                    {
                        entity.LanguageId = language.Id;
                    }
                }

                if (entity.LanguageId == 0)
                {
                    var defaultLanguage = await appDbContext.VideoLanguages.FirstOrDefaultAsync(l => l.LanguageCode == "uk");
                    if (defaultLanguage != null)
                    {
                        entity.LanguageId = defaultLanguage.Id;
                    }
                }

                await appDbContext.Videos.AddAsync(entity);
                await appDbContext.SaveChangesAsync();
            }
        }
    }
    
    public async Task SeedTagsAsync(string jsonPath)
    {
        if (await appDbContext.Tags.AnyAsync(t => !t.IsDeleted))
            return;

        if (!File.Exists(jsonPath))
            throw new FileNotFoundException("Файл Tags.json не знайдено.", jsonPath);

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

    public async Task SeedVideoLanguagesAsync(string jsonPath)
    {
        if (await appDbContext.VideoLanguages.AnyAsync())
            return;

        if (!File.Exists(jsonPath))
            throw new FileNotFoundException("Файл Languages.json не знайдено.", jsonPath);

        var json = await File.ReadAllTextAsync(jsonPath);
        var languagesData = JsonSerializer.Deserialize<List<LanguageSeedModel>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        if (languagesData != null)
        {
            var languages = languagesData.Select(l => mapper.Map<VideoLanguageEntity>(l)).ToList();
            await appDbContext.VideoLanguages.AddRangeAsync(languages);
            await appDbContext.SaveChangesAsync();
        }
    }

    public async Task SeedRolesAsync()
    {
        foreach (var roleName in Roles.AllRoles)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                var result = await roleManager.CreateAsync(new RoleEntity
                {
                    Name = roleName
                });

                if (!result.Succeeded)
                {
                    Console.WriteLine($"Error Create Role {roleName}");
                }
            }
        }
    }

    public async Task UpdateDatabase()
    {
        await appDbContext.Database.MigrateAsync();
    }
}
