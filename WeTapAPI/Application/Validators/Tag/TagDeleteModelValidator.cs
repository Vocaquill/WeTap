using Application.Models.Tag;
using Domain;
using Domain.Entities.Tag;
using FluentValidation;
using Application.Validators.Extensions;

namespace Application.Validators.Tag;

public class TagDeleteModelValidator : AbstractValidator<TagDeleteModel>
{
    public TagDeleteModelValidator(AppDbContext db)
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Id повинен бути більше 0")
            .MustExistAsync<TagDeleteModel, TagEntity, long>(db, "Тег не знайдено");
    }
}
