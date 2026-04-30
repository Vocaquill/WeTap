using Application.Models.Tag;
using Domain;
using Domain.Entities.Tag;
using FluentValidation;
using Application.Validators.Extensions;

namespace Application.Validators.Tag;

public class TagCreateModelValidator : AbstractValidator<TagCreateModel>
{
    public TagCreateModelValidator(AppDbContext db)
    {
        RuleFor(x => x.Name)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Назва тегу є обов'язковою")
            .MaximumLength(100).WithMessage("Назва тегу не повинна перевищувати 100 символів")
            .UniquePropertyAsync<TagCreateModel, TagEntity, long>(db, "Name", "Тег з такою назвою вже існує");

        RuleFor(x => x.Slug)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Слаг є обов'язковим")
            .MaximumLength(100).WithMessage("Слаг не повинен перевищувати 100 символів")
            .IsSlug()
            .UniqueSlugAsync<TagCreateModel, TagEntity, long>(db, "Тег з таким слагом вже існує");
    }
}
