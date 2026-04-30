using Application.Models.Language;
using MediatR;

namespace Application.Features.Languages.Commands.DeleteLanguage;

public record DeleteLanguageCommand(LanguageDeleteModel Model)
    : IRequest;
