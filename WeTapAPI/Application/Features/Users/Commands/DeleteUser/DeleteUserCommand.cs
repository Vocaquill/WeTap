using MediatR;

namespace Application.Features.Users.Commands.DeleteUser;

public record DeleteUserCommand(long Id) : IRequest;
