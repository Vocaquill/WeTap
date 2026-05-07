using Application.Models.Channel;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.Channel.Commands.CreateChannel;

public record CreateChannelCommand(ChannelCreateModel Model) : IRequest<ChannelItemModel>;
