using Application.Models.Video;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.Videos.Commands.UpdateVideo;

public record UpdateVideoCommand(VideoUpdateModel Model) : IRequest<VideoItemModel>{}
