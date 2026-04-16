using Application.Models.Account;
using Application.Models.User;
using AutoMapper;
using Domain.Entities.Identity;

namespace Application.Mappings;

public class UserMapper: Profile
{
    public UserMapper()
    {
        CreateMap<UserEntity, UserItemModel>()
            .ForMember(dest => dest.IsLoginGoogle, opt => opt.MapFrom(src => src.UserLogins!.Any(l => l.LoginProvider == "Google")))
            .ForMember(dest => dest.IsLoginPassword, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.PasswordHash)))
            .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.UserRoles!.Select(ur => ur.Role.Name).ToList()))
            .ForMember(dest => dest.LoginTypes, opt => opt.Ignore());

        CreateMap<AccountRegisterModel, UserEntity>()
            .ForMember(x => x.UserName, opt => opt.MapFrom(x => x.Email))
            .ForMember(x => x.Image, opt => opt.Ignore());

        CreateMap<AccountGoogleAccountModel, UserEntity>()
            .ForMember(x => x.Image, opt => opt.Ignore())
            .ForMember(x => x.UserName, opt => opt.MapFrom(x => x.Email));

        //CreateMap<UserSeederModel, UserEntity>()
        //    .ForMember(opt => opt.UserName, opt => opt.MapFrom(x => x.Email))
        //    .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.ImagePath));

        CreateMap<UserEditModel, UserEntity>()
            .ForMember(dest => dest.Image, opt => opt.Ignore());
    }
}
