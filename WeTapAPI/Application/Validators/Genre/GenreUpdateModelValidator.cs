using Application.Models.Genre;
using Domain;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.Validators.Genre;

public class GenreUpdateModelValidator : AbstractValidator<GenreUpdateModel>
{
    public GenreUpdateModelValidator(AppDbContext db)
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Id повинен бути більше 0")
            .MustAsync(async (id, cancellation) =>
                await db.Genres.AnyAsync(
                    g => g.Id == id && !g.IsDeleted,
                    cancellation))
            .WithMessage("Жанр не знайдено");

        RuleFor(x => x.Name)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Назва жанру є обов'язковою")
            .MaximumLength(100).WithMessage("Назва жанру не повинна перевищувати 100 символів");

        RuleFor(x => x.Slug)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Слаг є обов'язковим")
            .MaximumLength(100).WithMessage("Слаг не повинен перевищувати 100 символів")
            .MustAsync(async (model, slug, cancellation) =>
            {
                var normalized = slug!.Trim().ToLower().Replace(" ", "-");
                return !await db.Genres.AnyAsync(
                    g => !g.IsDeleted &&
                         g.Slug == normalized &&
                         g.Id != model.Id,
                    cancellation);
            })
            .WithMessage("Інший жанр з таким слагом вже існує");
    }
}
