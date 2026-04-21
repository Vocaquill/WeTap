using Application.Models.Language;
using MediatR;

namespace Application.Features.Languages.Commands.CreateLanguage;

public record CreateLanguageCommand(LanguageCreateModel Model)
    : IRequest<LanguageItemModel>;
