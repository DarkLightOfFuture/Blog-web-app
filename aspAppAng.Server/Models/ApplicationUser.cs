using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace aspAppAngular.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        [Required]
        [StringLength(30, MinimumLength = 5)]
        public override string UserName { get; set; }
		[Required]
        [StringLength(50)]
        public string? FirstName { get; set; }
        [Required]
        [StringLength(50)]
        public string? LastName { get; set; }
        public string Avatar { get; set; } = "/avatars/defaultAvatar.jpg";
        public ICollection<RatingChoice> RatingChoices { get; set; } = new List<RatingChoice>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<Post> Posts { get; set; } = new List<Post>();
        public string FullInfo => string.Format($"{Id} | {Email}");
    }
}
