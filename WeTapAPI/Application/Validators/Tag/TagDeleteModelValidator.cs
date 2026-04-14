using Application.Models.Tag;
using Domain;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.Validators.Tag;

public class TagDeleteModelValidator : AbstractValidator<TagDeleteModel>
{
    public TagDeleteModelValidator(AppDbContext db)
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Id повинен бути більше 0")
            .MustAsync(async (id, cancellation) =>
                await db.Tags.AnyAsync(
                    t => t.Id == id && !t.IsDeleted,
                    cancellation))
            .WithMessage("Тег не знайдено");
    }
}
