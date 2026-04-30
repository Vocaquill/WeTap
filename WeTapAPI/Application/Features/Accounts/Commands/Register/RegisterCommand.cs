using Application.Models.Account;
using MediatR;

namespace Application.Features.Accounts.Commands.Register;

public record RegisterCommand(AccountRegisterModel Model) : IRequest<string>;
