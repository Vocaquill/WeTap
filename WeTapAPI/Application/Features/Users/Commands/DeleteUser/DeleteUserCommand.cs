using MediatR;

namespace Application.Features.Users.Commands.DeleteUser;

public record DeleteUserCommand(int Id) : IRequest;
