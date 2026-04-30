using Application.Models.Language;
using Application.Models.Search;
using MediatR;

namespace Application.Features.Languages.Queries.GetByLanguage;

public record GetByLanguageQuery(GetByModel Model)
    : IRequest<LanguageItemModel?>;
