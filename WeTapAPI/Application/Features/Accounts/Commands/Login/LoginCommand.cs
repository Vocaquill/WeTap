using Application.Models.Account;
using MediatR;

namespace Application.Features.Accounts.Commands.Login;

public record LoginCommand(AccountLoginModel Model) : IRequest<string>;
