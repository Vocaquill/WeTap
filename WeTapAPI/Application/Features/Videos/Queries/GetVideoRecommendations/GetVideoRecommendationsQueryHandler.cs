using Application.Constants;
using Application.Interfaces;
using Application.Mappings;
using Application.Models.Video;
using Domain.Entities.Video;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Videos.Queries.GetVideoRecommendations;

public class GetVideoRecommendationsQueryHandler(
    IGenericRepository<VideoEntity, long> repo,
    VideoMappingProfile mapper,
    ICurrentUserService currentUser,
    IVideoRecommendationService recommendationService)
    : IRequestHandler<GetVideoRecommendationsQuery, IEnumerable<VideoItemModel>>
{
    private const int MaxRecommendations = 10;

    public async Task<IEnumerable<VideoItemModel>> Handle(
        GetVideoRecommendationsQuery request,
        CancellationToken cancellationToken)
    {
        var source = await repo.AsQurable()
            .AsNoTracking()
            .Include(v => v.VideoGenres)
            .Include(v => v.VideoTags)
            .FirstOrDefaultAsync(v => v.Id == request.Model.VideoId && !v.IsDeleted, cancellationToken)
            ?? throw new Exception("Відео не знайдено");

        var genreIds = source.VideoGenres?.Select(g => g.GenreId).ToList() ?? [];
        var tagIds   = source.VideoTags?.Select(t => t.TagId).ToList()   ?? [];

        IQueryable<VideoEntity> candidatesQuery = repo.AsQurable()
            .AsNoTracking()
            .Where(v => !v.IsDeleted
                     && v.Id != source.Id
                     && v.Video != "processing...")
            .ForCurrentUser(currentUser);

        if (genreIds.Count > 0 || tagIds.Count > 0)
        {
            candidatesQuery = candidatesQuery.Where(v =>
                (v.VideoGenres != null && v.VideoGenres.Any(g => genreIds.Contains(g.GenreId))) ||
                (v.VideoTags   != null && v.VideoTags.Any(t => tagIds.Contains(t.TagId))));
        }

        var candidates = await candidatesQuery
            .Include(v => v.VideoGenres)
            .Include(v => v.VideoTags)
            .ToListAsync(cancellationToken);

        if (candidates.Count == 0)
        {
            var titleWords = source.Title
                .ToLowerInvariant()
                .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                .Where(w => w.Length >= 3)
                .Take(5)
                .ToList();

            if (titleWords.Count > 0)
            {
                IQueryable<VideoEntity> fallbackQuery = repo.AsQurable()
                    .AsNoTracking()
                    .Where(v => !v.IsDeleted
                             && v.Id != source.Id
                             && v.Video != "processing...")
                    .ForCurrentUser(currentUser);

                foreach (var word in titleWords)
                {
                    var w = word;
                    fallbackQuery = fallbackQuery.Where(v =>
                        v.Title.ToLower().Contains(w) ||
                        v.Description.ToLower().Contains(w));
                }

                candidates = await fallbackQuery
                    .Include(v => v.VideoGenres)
                    .Include(v => v.VideoTags)
                    .ToListAsync(cancellationToken);
            }
        }

        var topIds = candidates
            .Select(c => new { Entity = c, Score = recommendationService.ComputeScore(source, c) })
            .Where(x => x.Score > 0)
            .OrderByDescending(x => x.Score)
            .Take(MaxRecommendations)
            .Select(x => x.Entity.Id)
            .ToHashSet();

        if (topIds.Count == 0)
            return [];

        return await mapper
            .ProjectToItemModel(
                repo.AsQurable()
                    .AsNoTracking()
                    .Where(v => topIds.Contains(v.Id))
            )
            .ToListAsync(cancellationToken);
    }
}
