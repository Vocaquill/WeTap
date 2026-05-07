using Application.Models.Comments;
using AutoMapper;
using Domain.Entities.Comments;

namespace Application.Mappings;

public class CommentMappingProfile : Profile
{
    public CommentMappingProfile()
    {
        CreateMap<CommentsEntity, CommentsItemModal>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName))
            .ForMember(dest => dest.UserImage, opt => opt.MapFrom(src => src.User.Image));
    }
}
