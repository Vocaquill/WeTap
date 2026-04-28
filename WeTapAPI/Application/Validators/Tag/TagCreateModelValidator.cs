using Application.Models.Tag;
using Domain;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Application.Validators;

namespace Application.Validators.Tag;

public class TagCreateModelValidator : AbstractValidator<TagCreateModel>
{
    public TagCreateModelValidator(AppDbContext db)
    {
        RuleFor(x => x.Name)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Назва тегу є обов'язковою")
            .MaximumLength(100).WithMessage("Назва тегу не повинна перевищувати 100 символів")
            .MustAsync(async (name, cancellation) =>
            {
                var normalized = name!.Trim().ToLower();
                return !await db.Tags.AnyAsync(
                    t => !t.IsDeleted && t.Name.ToLower() == normalized,
                    cancellation);
            })
            .WithMessage("Тег з такою назвою вже існує");

        RuleFor(x => x.Slug)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Слаг є обов'язковим")
            .MaximumLength(100).WithMessage("Слаг не повинен перевищувати 100 символів")
            .IsSlug()
            .MustAsync(async (slug, cancellation) =>
            {
                var normalized = slug!.Trim().ToLower().Replace(" ", "-");
                return !await db.Tags.AnyAsync(
                    t => !t.IsDeleted && t.Slug == normalized,
                    cancellation);
            })
            .WithMessage("Тег з таким слагом вже існує");
    }
}
