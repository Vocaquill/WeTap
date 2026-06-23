using MediatR;

namespace Application.Features.Accounts.Commands.RefreshToken;

public record RefreshTokenCommand() : IRequest<string>;
