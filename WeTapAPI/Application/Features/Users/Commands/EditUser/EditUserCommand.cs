using Application.Models.User;
using MediatR;

namespace Application.Features.Users.Commands.EditUser;

public record EditUserCommand(UserEditModel Model) : IRequest<string>;
