using Application.Models.Comments;
using Domain.Entities.Comments;
using Riok.Mapperly.Abstractions;

namespace Application.Mappings;

[Mapper]
public partial class CommentMappingProfile
{
    [MapProperty(nameof(CommentsEntity.User) + "." + nameof(CommentsEntity.User.UserName), nameof(CommentsItemModal.UserName))]
    [MapProperty(nameof(CommentsEntity.User) + "." + nameof(CommentsEntity.User.Image), nameof(CommentsItemModal.UserImage))]
    public partial CommentsItemModal MapToItemModel(CommentsEntity entity);

    public partial IQueryable<CommentsItemModal> ProjectToItemModel(IQueryable<CommentsEntity> query);
}
