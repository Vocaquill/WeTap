using Application.Models.Account;
using MediatR;

namespace Application.Features.Accounts.Commands.ChangePassword;

public record ChangePasswordCommand(AccountChangePasswordModel Model) : IRequest;
