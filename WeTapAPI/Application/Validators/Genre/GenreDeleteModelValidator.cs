using Application.Models.Genre;
using Domain;
using Domain.Entities.Genre;
using FluentValidation;
using Application.Validators.Extensions;

namespace Application.Validators.Genre;

public class GenreDeleteModelValidator : AbstractValidator<GenreDeleteModel>
{
    public GenreDeleteModelValidator(AppDbContext db)
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Id повинен бути більше 0")
            .MustExistAsync<GenreDeleteModel, GenreEntity, long>(db, "Жанр не знайдено");
    }
}
