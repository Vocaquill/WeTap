using Application.Models.Account;
using MediatR;

namespace Application.Features.Accounts.Commands.GoogleLogin;

public record GoogleLoginCommand(AccountGoogleLoginRequestModel Model) : IRequest<string>;
