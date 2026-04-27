using Application.Models.Tag;
using Domain;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Application.Validators;

namespace Application.Validators.Tag;

public class TagUpdateModelValidator : AbstractValidator<TagUpdateModel>
{
    public TagUpdateModelValidator(AppDbContext db)
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Id повинен бути більше 0")
            .MustAsync(async (id, cancellation) =>
                await db.Tags.AnyAsync(
                    t => t.Id == id && !t.IsDeleted,
                    cancellation))
            .WithMessage("Тег не знайдено");

        RuleFor(x => x.Name)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Назва тегу є обов'язковою")
            .MaximumLength(100).WithMessage("Назва тегу не повинна перевищувати 100 символів");

        RuleFor(x => x.Slug)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Слаг є обов'язковим")
            .MaximumLength(100).WithMessage("Слаг не повинен перевищувати 100 символів")
            .IsSlug()
            .MustAsync(async (model, slug, cancellation) =>
            {
                var normalized = slug!.Trim().ToLower().Replace(" ", "-");
                return !await db.Tags.AnyAsync(
                    t => !t.IsDeleted &&
                         t.Slug == normalized &&
                         t.Id != model.Id,
                    cancellation);
            })
            .WithMessage("Інший тег з таким слагом вже існує");
    }
}
