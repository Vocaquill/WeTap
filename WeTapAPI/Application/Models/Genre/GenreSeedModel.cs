using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Models.Genre;

public class GenreSeedModel
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? ImagePath { get; set; }
}
