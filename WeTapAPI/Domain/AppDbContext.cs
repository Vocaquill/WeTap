using Domain.Entities.Channel;
using Domain.Entities.Comments;
using Domain.Entities.Genre;
using Domain.Entities.Identity;
using Domain.Entities.Language;
using Domain.Entities.Tag;
using Domain.Entities.Video;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Domain;

public class AppDbContext
    : IdentityDbContext<
        UserEntity,
        RoleEntity,
        long,
        IdentityUserClaim<long>,
        UserRoleEntity,
        UserLoginEntity,
        IdentityRoleClaim<long>,
        IdentityUserToken<long>
    >
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<CommentsEntity> Comments { get; set; }
    public DbSet<GenreEntity> Genres { get; set; }
    public DbSet<VideoEntity> Videos { get; set; }
    public DbSet<TagEntity> Tags { get; set; }
    public DbSet<VideoPrivacyEntity> VideoPrivacies { get; set; }
    public DbSet<VideoLanguageEntity> VideoLanguages { get; set; }
    public DbSet<ChannelEntity> Channels { get; set; }
    public DbSet<ChannelSubscriberEntity> ChannelSubscribers { get; set; }
    public DbSet<VideoReactionEntity> VideoReactions { get; set; }

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

        modelBuilder.Entity<ChannelEntity>().Property(c => c.Id).ValueGeneratedNever();

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

        // CommentsEntity
        modelBuilder.Entity<CommentsEntity>(entity =>
        {
            entity
                .HasOne(c => c.Video)
                .WithMany(v => v.Comments)
                .HasForeignKey(c => c.VideoId)
                .OnDelete(DeleteBehavior.Cascade);
            entity
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity
                .HasOne(c => c.Parent)
                .WithMany(c => c.Replies)
                .HasForeignKey(c => c.ParentId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
