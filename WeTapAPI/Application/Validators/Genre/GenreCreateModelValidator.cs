using Application.Models.Genre;
using Domain;
using Domain.Entities.Genre;
using FluentValidation;
using Application.Validators.Extensions;

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
            .IsSlug()
            .UniqueSlugAsync<GenreCreateModel, GenreEntity, long>(db, "Жанр з таким слагом вже існує");

        RuleFor(x => x.Image)
            .IsImage();
    }
}
