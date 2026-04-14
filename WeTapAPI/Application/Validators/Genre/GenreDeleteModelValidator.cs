using Application.Models.Genre;
using Domain;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.Validators.Genre;

public class GenreDeleteModelValidator : AbstractValidator<GenreDeleteModel>
{
    public GenreDeleteModelValidator(AppDbContext db)
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Id повинен бути більше 0")
            .MustAsync(async (id, cancellation) =>
                await db.Genres.AnyAsync(
                    g => g.Id == id && !g.IsDeleted,
                    cancellation))
            .WithMessage("Жанр не знайдено");
    }
}
