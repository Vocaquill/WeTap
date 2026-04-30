using Application.Interfaces;
using Application.Models.Video;
using AutoMapper;
using Domain.Entities.Video;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Videos.Commands.DeleteVideo;

public class DeleteVideoHandler(IGenericRepository<VideoEntity, long> repo)
    : IRequestHandler<DeleteVideoCommand>
{
    public async Task Handle(DeleteVideoCommand request, CancellationToken cancellationToken)
    {
        VideoEntity video;

        try
        {
            video = await repo.AsQurable().Where(x => x.Id == request.Model.Id && !x.IsDeleted).FirstAsync();
            if (video == null)
                throw new Exception();
        }
        catch (Exception)
        {
            throw new Exception("Відео не знайдено");
        }

        await repo.DeleteAsync(video.Id);
    }
}
