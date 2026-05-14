using Application.Models.Account;
using MediatR;

namespace Application.Features.Accounts.Queries.ValidateResetToken;

public record ValidateResetTokenQuery(AccountValidateResetTokenModel Model): IRequest<bool>;
