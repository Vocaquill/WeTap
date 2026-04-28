using Application.Models.Language;
using Application.Models.Search;
using MediatR;

namespace Application.Features.Languages.Queries.SearchLanguages;

public record SearchLanguagesQuery(LanguageSearchModel Model)
    : IRequest<SearchResult<LanguageItemModel>>;
