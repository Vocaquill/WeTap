using MediatR;

namespace Application.Features.Accounts.Commands.RefreshToken;

public record RefreshTokenCommand(long UserId) : IRequest<string>;
