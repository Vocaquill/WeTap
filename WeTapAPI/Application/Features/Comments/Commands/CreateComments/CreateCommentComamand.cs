using Application.Models.Comments;
using MediatR;

namespace Application.Features.Comments.Commands.CreateComment;

public record CreateCommentCommand(
    string Content,
    long VideoId,
    long? ParentId, // null для звичайного коментаря, ID батька — для відповіді
    long UserId // ID користувача, який пише (дістанемо в контролері)
) : IRequest<CommentsItemModal>;
