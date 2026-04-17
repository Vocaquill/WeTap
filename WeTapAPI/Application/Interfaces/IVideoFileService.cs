using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Interfaces;

public interface IVideoFileService
{
    Task<string> SaveVideoAsync(IFormFile file);
    Task<string> SaveVideoFromFilePathAsync(string filePath);
    Task<string> SaveVideoWithProgressAsync(string filePath, Action<Application.Models.VideoProcessing.VideoProgressUpdate> onProgress);
    Task DeleteVideoAsync(string name);
}
