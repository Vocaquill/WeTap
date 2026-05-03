using Domain.Entities.Genre;
using Domain.Entities.Identity;
using Domain.Entities.Tag;
using Domain.Entities.Video;
using Domain.Entities.Language;
using Domain.Entities.Channel;
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
    public DbSet<VideoPrivacyEntity> VideoPrivacies { get; set; }
    public DbSet<VideoLanguageEntity> VideoLanguages { get; set; }
    public DbSet<ChannelEntity> Channels { get; set; }
    public DbSet<ChannelSubscriberEntity> ChannelSubscribers { get; set; }

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

        modelBuilder.Entity<ChannelEntity>()
            .Property(c => c.Id)
            .ValueGeneratedNever();

        modelBuilder.Entity<ChannelEntity>(c =>
        {
            c.HasOne(c => c.Author)
                .WithOne(u => u.Channel)
                .HasForeignKey<ChannelEntity>(c => c.Id)
                .IsRequired();
        });

        modelBuilder.Entity<ChannelSubscriberEntity>(cs =>
        {
            cs.HasKey(x => new { x.ChannelId, x.UserId });

            cs.HasOne(x => x.Channel)
                .WithMany(c => c.Subscribers)
                .HasForeignKey(x => x.ChannelId)
                .IsRequired();

            cs.HasOne(x => x.User)
                .WithMany(u => u.SubscribedChannels)
                .HasForeignKey(x => x.UserId)
                .IsRequired();
        });
    }
}
