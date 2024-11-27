using System.ComponentModel.DataAnnotations.Schema;

namespace aspAppAngular.Server.Models
{
    public class RatingChoice
    {
        public int id { get; set; }
        public bool? IsLiked { get; set; }
        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }
        public string PostId { get; set; }
        [ForeignKey("PostId")]
        public Post Post { get; set; }
    }
}
