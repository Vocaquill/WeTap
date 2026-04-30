using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Users.Commands.DeleteUser;

public class DeleteUserHandler(AppDbContext context) : IRequestHandler<DeleteUserCommand>
{
    public async Task Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        var user = await context.Users.FirstOrDefaultAsync(x => x.Id == request.Id && !x.IsDeleted);
        if (user != null)
        {
            user.IsDeleted = true;
            context.Users.Update(user);
            await context.SaveChangesAsync();
        }
    }
}
