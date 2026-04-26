using Application.Constants;
using FluentValidation;
using Microsoft.AspNetCore.Http;

namespace Application.Validators;

public static class FileValidatorExtensions
{
    public static IRuleBuilderOptions<T, IFormFile?> IsImage<T>(this IRuleBuilder<T, IFormFile?> ruleBuilder)
    {
        return ruleBuilder
            .Must(file =>
            {
                if (file == null) return true;
                
                var extension = Path.GetExtension(file.FileName).ToLower();
                return FileConstants.AllowedImageExtensions.Contains(extension) &&
                       FileConstants.AllowedImageContentTypes.Contains(file.ContentType.ToLower());
            })
            .WithMessage($"Недопустимий тип файлу. Дозволені формати: {string.Join(", ", FileConstants.AllowedImageExtensions)}");
    }
}
