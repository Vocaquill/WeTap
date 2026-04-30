using Application.Models.Video;
using Domain;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Application.Validators;

namespace Application.Validators.Video;

public class VideoCreateModelValidator : AbstractValidator<VideoCreateModel>
{
    public VideoCreateModelValidator(AppDbContext db)
    {
        RuleFor(x => x.Title)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Назва є обов'язковою")
            .MaximumLength(255).WithMessage("Назва повинна містити не більше 255 символів");

        RuleFor(x => x.Slug)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Слаг є обов'язковим")
            .MaximumLength(255).WithMessage("Слаг повинен містити не більше 255 символів")
            .IsSlug()
            .MustAsync(async (slug, cancellation) =>
            {
                var normalized = slug!.Trim().ToLower().Replace(" ", "-");
                return !await db.Videos.AnyAsync(
                    v => !v.IsDeleted && v.Slug == normalized,
                    cancellation);
            })
            .WithMessage("Відео з таким слагом вже існує");

        RuleFor(x => x.GenreIds)
            .Cascade(CascadeMode.Stop)
            .MustAsync(async (genreIds, cancellation) =>
            {
                if (genreIds == null || genreIds.Length == 0) return true;

                var count = await db.Genres
                    .CountAsync(g =>
                        genreIds.Contains(g.Id) && !g.IsDeleted,
                        cancellation);

                return count == genreIds.Distinct().Count();
            })
            .WithMessage("Один або кілька обраних жанрів не знайдено");

        RuleFor(x => x.TagIds)
            .Cascade(CascadeMode.Stop)
            .MustAsync(async (tagIds, cancellation) =>
            {
                if (tagIds == null || tagIds.Length == 0) return true;

                var count = await db.Tags
                    .CountAsync(t =>
                        tagIds.Contains(t.Id) && !t.IsDeleted,
                        cancellation);

                return count == tagIds.Distinct().Count();
            })
            .WithMessage("Один або кілька обраних тегів не знайдено");

        RuleFor(x => x.Video)
            .NotNull().WithMessage("Відео-файл є обов'язковим")
            .IsVideo();

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Опис повинен містити не більше 1000 символів");

        RuleFor(x => x.LanguageId)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Мова є обов'язковою")
            .MustAsync(async (langId, cancellation) =>
            {
                return await db.VideoLanguages.AnyAsync(l => l.Id == langId, cancellation);
            })
            .WithMessage("Мову не знайдено");

        RuleFor(x => x.PrivacyId)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Приватність є обов'язковою")
            .MustAsync(async (privacyId, cancellation) =>
            {
                return await db.VideoPrivacies.AnyAsync(p => p.Id == privacyId, cancellation);
            })
            .WithMessage("Приватність не знайдено");

        RuleFor(x => x.Image)
            .IsImage();
    }
}
