using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Interfaces;

public interface ISeederService
{
    public Task UpdateDatabase();
    public Task SeedGenresAsync(string jsonPath);
    public Task SeedVideosAsync(string jsonPath, string videosFolder);
}
