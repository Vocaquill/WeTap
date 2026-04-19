using Microsoft.AspNetCore.SignalR;

namespace Application.Hubs;

public class VideoProgressHub : Hub
{
    public async Task JoinChannel(string trackingId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, trackingId);
    }

    public async Task LeaveChannel(string trackingId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, trackingId);
    }
}
