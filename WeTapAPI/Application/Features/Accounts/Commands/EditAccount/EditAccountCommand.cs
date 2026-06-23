using Application.Models.User;
using MediatR;

namespace Application.Features.Accounts.Commands.EditAccount;

public record EditAccountCommand(UserEditModel Model) : IRequest<string>;
