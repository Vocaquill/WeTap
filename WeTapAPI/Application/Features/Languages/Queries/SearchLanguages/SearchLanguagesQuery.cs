using Application.Models.Language;
using MediatR;

namespace Application.Features.Languages.Queries.SearchLanguages;

public record SearchLanguagesQuery(LanguageSearchModel Model)
    : IRequest<IEnumerable<LanguageItemModel>>;
