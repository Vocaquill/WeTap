using Application.Models.Tag;
using Domain;
using Domain.Entities.Tag;
using FluentValidation;
using Application.Validators.Extensions;

namespace Application.Validators.Tag;

public class TagUpdateModelValidator : AbstractValidator<TagUpdateModel>
{
    public TagUpdateModelValidator(AppDbContext db)
    {
        RuleFor(x => x.Id)
            .Cascade(CascadeMode.Stop)
            .GreaterThan(0).WithMessage("Id повинен бути більше 0")
            .MustExistAsync<TagUpdateModel, TagEntity, long>(db, "Тег не знайдено");

        RuleFor(x => x.Name)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Назва тегу є обов'язковою")
            .MaximumLength(100).WithMessage("Назва тегу не повинна перевищувати 100 символів")
            .UniquePropertyUpdateAsync<TagUpdateModel, TagEntity, long>(db, "Name", x => x.Id, "Інший тег з такою назвою вже існує");

        RuleFor(x => x.Slug)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Слаг є обов'язковим")
            .MaximumLength(100).WithMessage("Слаг не повинен перевищувати 100 символів")
            .IsSlug()
            .UniqueSlugUpdateAsync<TagUpdateModel, TagEntity, long>(db, x => x.Id, "Інший тег з таким слагом вже існує");
    }
}
