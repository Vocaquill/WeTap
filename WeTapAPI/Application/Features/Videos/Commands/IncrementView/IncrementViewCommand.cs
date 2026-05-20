namespace Application.Features.Videos.Commands.IncrementView;

public class IncrementViewCommand(long id) : MediatR.IRequest
{
    public long Id { get; set; } = id;
}
