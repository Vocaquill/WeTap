using Application.Models.Account;
using MediatR;

namespace Application.Features.Accounts.Commands.ForgotPassword;

public record ForgotPasswordCommand(AccountForgotPasswordModel Model) : IRequest<bool>;
