using Application.Models.Genre;
using Domain;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Application.Validators;

namespace Application.Validators.Genre;

public class GenreCreateModelValidator : AbstractValidator<GenreCreateModel>
{
    public GenreCreateModelValidator(AppDbContext db)
    {
        RuleFor(x => x.Name)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Назва жанру є обов'язковою")
            .MaximumLength(100).WithMessage("Назва жанру не повинна перевищувати 100 символів");

        RuleFor(x => x.Slug)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Слаг є обов'язковим")
            .MaximumLength(100).WithMessage("Слаг не повинен перевищувати 100 символів")
            .MustAsync(async (slug, cancellation) =>
            {
                var normalized = slug!.Trim().ToLower().Replace(" ", "-");
                return !await db.Genres.AnyAsync(
                    g => !g.IsDeleted && g.Slug == normalized,
                    cancellation);
            })
            .WithMessage("Жанр з таким слагом вже існує");

        RuleFor(x => x.Image)
            .IsImage();
    }
}
