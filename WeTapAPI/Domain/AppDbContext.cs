using Domain.Entities.Genre;
using Domain.Entities.Video;
using Microsoft.EntityFrameworkCore;

namespace Domain;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<GenreEntity> Genres { get; set; }
    public DbSet<VideoEntity> Videos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<VideoGenresEntity>(mg =>
        {
            mg.HasKey(x => new { x.VideoId, x.GenreId });

            mg.HasOne(x => x.Video)
                .WithMany(m => m.VideoGenres)
                .HasForeignKey(x => x.VideoId)
                .IsRequired();

            mg.HasOne(x => x.Genre)
                .WithMany(g => g.VideoGenres)
                .HasForeignKey(x => x.GenreId)
                .IsRequired();
        });
    }
}
