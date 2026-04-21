using Application.Models.Language;
using MediatR;

namespace Application.Features.Languages.Commands.UpdateLanguage;

public record UpdateLanguageCommand(LanguageUpdateModel Model)
    : IRequest<LanguageItemModel>;
