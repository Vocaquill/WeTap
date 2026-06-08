using Application.Models.Account;
using Application.Models.User;
using Domain.Entities.Identity;
using Riok.Mapperly.Abstractions;

namespace Application.Mappings;

[Mapper]
public partial class UserMapping
{
    [MapperIgnoreTarget(nameof(UserItemModel.IsLoginGoogle))]
    [MapperIgnoreTarget(nameof(UserItemModel.IsLoginPassword))]
    [MapperIgnoreTarget(nameof(UserItemModel.Roles))]
    [MapperIgnoreTarget(nameof(UserItemModel.LoginTypes))]
    public partial UserItemModel MapToItemModel(UserEntity entity);

    [MapProperty(nameof(AccountRegisterModel.Email), nameof(UserEntity.UserName))]
    [MapperIgnoreTarget(nameof(UserEntity.Image))]
    public partial UserEntity MapToEntity(AccountRegisterModel model);

    [MapProperty(nameof(AccountGoogleAccountModel.Email), nameof(UserEntity.UserName))]
    [MapperIgnoreTarget(nameof(UserEntity.Image))]
    public partial UserEntity MapToEntity(AccountGoogleAccountModel model);

    [MapProperty(nameof(UserSeedModel.Email), nameof(UserEntity.UserName))]
    [MapProperty(nameof(UserSeedModel.ImagePath), nameof(UserEntity.Image))]
    public partial UserEntity MapToEntity(UserSeedModel model);

    [MapperIgnoreTarget(nameof(UserEntity.Image))]
    public partial void MapToEntity(UserEditModel model, UserEntity entity);

    public partial IQueryable<UserItemModel> ProjectToItemModel(IQueryable<UserEntity> query);
}
