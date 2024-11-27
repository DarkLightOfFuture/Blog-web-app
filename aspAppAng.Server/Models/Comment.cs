using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace aspAppAngular.Server.Models
{
    public class Comment
    {
        public int Id { get; set; }
        [Required()]
        [StringLength(600, MinimumLength=10,  ErrorMessage = "Comment should contain between {2} and {1} characters.")]
        public string Content { get; set; }
        public DateTime PubDate { get; set; }
        [Display(Name = "user id")]
        public string UserId { get; set; }
        [Display(Name = "post id")]
        public string PostId { get; set; }
        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }
        [ForeignKey("PostId")]
        public Post Post { get; set; }

        public Comment()
        {

        }
    }

    public class CommentResponse
    {
        public Object Comment { get; set; }
        public bool CanDelete { get; set; }
		public bool CanReport { get; set; }
	}

    public class CommentPost
    {
        public string Content { get; set; }
        public string PostId { get; set; }
    }

    public class ChangeOrder
    {
        public string Id { get; set; }
        public bool IsAscending { get; set; }
    }
}
