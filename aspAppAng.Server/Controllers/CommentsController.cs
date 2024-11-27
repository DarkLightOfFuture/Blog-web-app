using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using aspAppAng.Server.Data;
using aspAppAngular.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace aspAppAng.Server.Controllers
{
    [ApiController]
    [Route("[controller]/api/")]
    public class CommentsController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public CommentsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet("get-items")]
        public async Task<IActionResult> GetItems([FromQuery] string? arg, [FromQuery] string? type, 
            [FromQuery] int? count, [FromQuery] bool? isAscending)
        {
            var query = _context.Comment.Include(x => x.User).AsQueryable();
            var isIndexDefault = arg == "null" && type == "null";
            var isSearchedByPostId = false;

            //For index page
            if (!isIndexDefault && !string.IsNullOrEmpty(arg) && !string.IsNullOrEmpty(type))
            {
                if (type == "content")
                {
                    query = query.Where(x => x.Content.Contains(arg.Trim()));
                }
                else if (type == "id")
                {
                    query = query.Where(x => x.Id.ToString().Contains(arg));
                }
                //Gets post's comments
                else if (type.ToLower() == "postid")
                {
                    isSearchedByPostId = arg.Last().ToString() == "~" ? true : false;

                    query = query.Where(x => isSearchedByPostId ? x.PostId.Contains(arg.Substring(0, arg.Length - 1)) : x.PostId == arg);
                }
            }

            query = query.Take(count ?? 10);

            //For post's comments
            if (type.ToLower() == "postid" && !isSearchedByPostId && query.Count() != 0)
            {
                var response = new List<CommentResponse>();
                
                var result = query.Select(x => new {
                    x.Id,
                    x.Content,
                    x.PubDate,
                    user = new { username = x.User.UserName, x.User.Avatar }
                }).ToArray();

                var user = User.Identity.Name != null ? 
                    await _userManager.FindByNameAsync(User.Identity.Name) : null;

                var isAdmin = user != null && (await _userManager.IsInRoleAsync(user, "admin"));

                foreach (var comment in isAscending == true ? result : result.Reverse())
                {
                    var canDelete = isAdmin || user != null && comment.user.username == user.UserName;
                    var canReport = user != null && comment.user.username != user.UserName;

                    response.Add(new CommentResponse()
                    {
                        Comment = comment,
                        CanDelete = canDelete,
                        CanReport = canReport
                    });
                }

                return Ok(response);
            }
            //If post has no comments.
            else if (type.ToLower() == "postid" && !isSearchedByPostId && query.Count() == 0)
            {
                Comment[] emptyArr = [];
                return Ok(emptyArr);
            }

            return Ok(query.Select(x => new
            {
                x.Id,
                x.PostId,
                x.PubDate,
                x.Content,
                user = new { Username = x.User.UserName }
            }).ToArray());
        }

        [Authorize]
        [ValidateAntiForgeryToken]
        [HttpPost("add")]
        public async Task<IActionResult> Create([FromBody] CommentPost commentForm)
        {
            var user = _context.User.FirstOrDefault(x => x.UserName == User.Identity.Name);
            var post = _context.Post.FirstOrDefault(x => x.Id == commentForm.PostId);

            if (user != null && post != null)
            {
                var comment = new Comment()
                {
                    Content = commentForm.Content,
                    PostId = commentForm.PostId,
                    Post = post,
                    PubDate = DateTime.Now,
                    User = user,
                    UserId = user.Id
                };

                _context.Comment.Add(comment);
                await _context.SaveChangesAsync();

                return Ok(comment.Id);
            }

            return BadRequest();
        }

        [HttpDelete("delete-item")]
        public async Task<IActionResult> DeleteComment([FromQuery] int id)
        {
            var user = _context.User.FirstOrDefault(x => x.UserName == User.Identity.Name);

            if (user != null)
            {
                var comment = _context.Comment.FirstOrDefault(x => x.Id == id);

                if (comment != null)
                {
                    var hasAdmin = await _userManager.IsInRoleAsync(user, "admin");

                    if (hasAdmin || comment.UserId == user.Id)
                    {
                        _context.Remove(comment);
                        await _context.SaveChangesAsync();

                        return Ok();
                    }
                }

                return BadRequest();
            }

            return BadRequest();
        }

        [Authorize(Roles = "admin")]
        [ValidateAntiForgeryToken]
        [HttpDelete("delete-items")]
        public async Task<IActionResult> DeleteComments(int[] idArray) 
        {
            foreach (var id in idArray)
            {
                var comment = _context.Comment.FirstOrDefault(x => x.Id == id);

                if (comment != null)
                {
                    _context.Comment.Remove(comment);
                }
            }

            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
