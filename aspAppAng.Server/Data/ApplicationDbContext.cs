namespace aspAppAng.Server.Data
{
    using aspAppAngular.Server.Models;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        public DbSet<Comment> Comment { get; set; }
        public DbSet<Post> Post { get; set; }
        public DbSet<Tag> Tag { get; set; } = default!;
        public DbSet<ApplicationUser> User { get; set; }
        public DbSet<RatingChoice> RatingChoice { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>().HasMany(c => c.Comments).WithOne(p => p.User).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<ApplicationUser>().HasMany(c => c.RatingChoices).WithOne(p => p.User).OnDelete(DeleteBehavior.NoAction);
            builder.Entity<ApplicationUser>().HasMany(c => c.Posts).WithOne(p => p.Author).OnDelete(DeleteBehavior.SetNull);

            builder.Entity<Comment>().HasOne(c => c.User).WithMany(p => p.Comments).HasForeignKey(k => k.UserId).OnDelete(DeleteBehavior.NoAction);
            builder.Entity<Comment>().HasOne(c => c.Post).WithMany(p => p.Comments).HasForeignKey(k => k.PostId).OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Post>().HasMany(c => c.Tags).WithMany(p => p.Posts);
            builder.Entity<Post>().HasMany(c => c.Comments).WithOne(p => p.Post).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Post>().HasMany(c => c.RatingChoices).WithOne(p => p.Post).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Post>().HasOne(c => c.Author).WithMany(p => p.Posts).OnDelete(DeleteBehavior.NoAction);
        }
    }
}
