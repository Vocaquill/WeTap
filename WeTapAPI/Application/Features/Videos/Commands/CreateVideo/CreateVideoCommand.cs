using Application.Models.Video;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

using Application.Models.VideoProcessing;

namespace Application.Features.Videos.Commands.CreateVideo;

public record CreateVideoCommand(VideoCreateModel Model) 
    : IRequest<VideoProcessingResult>;
