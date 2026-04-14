using Application.Models.Video;
using Domain;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Application.Validators.Video;

public class VideoDeleteModelValidator : AbstractValidator<VideoDeleteModel>
{
    public VideoDeleteModelValidator(AppDbContext db)
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Id повинен бути більше 0")
            .MustAsync(async (id, cancellation) =>
                await db.Videos.AnyAsync(
                    v => v.Id == (long)id && !v.IsDeleted,
                    cancellation))
            .WithMessage("Відео не знайдено");
    }
}
