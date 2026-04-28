using Application.Models.User;
using MediatR;

namespace Application.Features.Users.Queries.GetUserById;

public record GetUserByIdQuery(int Id) : IRequest<UserItemModel>;
