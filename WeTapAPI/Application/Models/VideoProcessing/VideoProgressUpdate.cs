namespace Application.Models.VideoProcessing;

public class VideoProgressUpdate
{
    public double Percentage { get; set; } // відсоток завершення обробки
    public string EstimatedTimeRemaining { get; set; } // скільки часу залишилось до завершення
    public string Status { get; set; } // статус обробки (напр: "Processing", "Completed", "Failed")
}

public class VideoProcessingResult
{
    public string TrackingId { get; set; }
}
