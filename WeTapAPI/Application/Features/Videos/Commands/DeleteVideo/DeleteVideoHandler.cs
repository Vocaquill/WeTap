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
        var video = await repo.GetByIdAsync(request.Model.Id);

        await repo.DeleteAsync(video.Id);
    }
}
