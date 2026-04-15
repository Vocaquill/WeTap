using Domain.Entities.Genre;
using Domain.Entities.Identity;
using Domain.Entities.Tag;
using Domain.Entities.Video;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Domain;

public class AppDbContext : 
        IdentityDbContext<UserEntity, RoleEntity, long, IdentityUserClaim<long>, UserRoleEntity, UserLoginEntity,
        IdentityRoleClaim<long>, IdentityUserToken<long>>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<GenreEntity> Genres { get; set; }
    public DbSet<VideoEntity> Videos { get; set; }
    public DbSet<TagEntity> Tags { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<UserRoleEntity>(ur =>
        {
            ur.HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(r => r.RoleId)
                .IsRequired();

            ur.HasOne(ur => ur.User)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(u => u.UserId)
                .IsRequired();
        });

        modelBuilder.Entity<UserLoginEntity>(b =>
        {
            b.HasOne(l => l.User)
                .WithMany(u => u.UserLogins)
                .HasForeignKey(l => l.UserId)
                .IsRequired();
        });

        modelBuilder.Entity<VideoGenreEntity>(mg =>
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
        
        modelBuilder.Entity<VideoTagEntity>(vt =>
        {
            vt.HasKey(x => new { x.VideoId, x.TagId });
            
            vt.HasOne(x => x.Video)
                .WithMany(v => v.VideoTags)
                .HasForeignKey(x => x.VideoId)
                .IsRequired();
            
            vt.HasOne(x => x.Tag)
                .WithMany(t => t.VideoTags)
                .HasForeignKey(x => x.TagId)
                .IsRequired();
        });
    }
}
