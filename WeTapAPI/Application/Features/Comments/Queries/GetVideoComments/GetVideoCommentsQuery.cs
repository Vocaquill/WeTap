using Application.Models.Comments;
using MediatR;

namespace Application.Features.Comments.Queries.GetVideoComments;

public record GetVideoCommentsQuery(long VideoId) : IRequest<List<CommentsItemModal>>;
