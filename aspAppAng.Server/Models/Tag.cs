using System.ComponentModel.DataAnnotations;

namespace aspAppAngular.Server.Models;

public class Tag
{
	public int Id { get; set; }
	[Required]
	[StringLength(50, MinimumLength = 3, ErrorMessage = "Tag name should contain between {2} and {1} characters.")]
	public string Name { get; set; }
	public int Count { get; set; } = 0;
	public ICollection<Post> Posts { get; set; } = new List<Post>();
}
