namespace Application.Models.VideoProcessing;

public class VideoProgressUpdate
{
    public double Percentage { get; set; }
    public string EstimatedTimeRemaining { get; set; } // e.g. "00:01:30"
    public string Status { get; set; } // e.g. "Uploading", "Processing", "Completed"
}

public class VideoProcessingResult
{
    public string TrackingId { get; set; }
}
