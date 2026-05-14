using Application.Models.Account;
using MediatR;

namespace Application.Features.Accounts.Commands.ResetPassword;

public record ResetPasswordCommand(AccountResetPasswordModel Model) : IRequest;
