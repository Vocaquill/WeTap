using Application.Models.Comments;
using MediatR;

namespace Application.Features.Comments.Queries.GetCommentsReplies;

public record GetCommentRepliesQuery(long ParentId) : IRequest<List<CommentsItemModal>>;
