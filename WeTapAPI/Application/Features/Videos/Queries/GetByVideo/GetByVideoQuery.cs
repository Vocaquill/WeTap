using Application.Models.Search;
using Application.Models.Video;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.Videos.Queries.GetByVideo;

public record GetByVideoQuery(GetByModel Model) : IRequest<VideoItemModel>;
