using Microsoft.AspNetCore.Mvc;
using aspAppAng.Server.Data;
using aspAppAngular.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace aspAppAng.Server.Controllers
{
    [ApiController]
    [Route("[controller]/api/")]
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public PostsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet("get-items")]
        public async Task<IActionResult> GetItems([FromQuery] string? arg, [FromQuery] string? type, 
            [FromQuery] int? count, [FromQuery] bool? isAscending)
        {
            var query = _context.Post.AsQueryable();
            var isIndexDefault = arg == "null" && type == "null";

            if (!isIndexDefault && !string.IsNullOrEmpty(arg) && !string.IsNullOrEmpty(type))
            {
                if (type == "description")
                {
                    query = query.Where(x => x.Description.Contains(arg.Trim()));
                }
                else if (type == "id")
                {
                    query = query.Where(x => x.Id.Contains(arg.Trim()));
                }
            }

            query = query.Take(count ?? 10);

            return arg != null && type != null? 
                Ok(query.Select(x => new { x.Id, x.Title }).ToArray()) :
                Ok(query.Select(x => new { x.Id, x.Thumbnail, x.Title }).ToArray());
        }

        [HttpGet("getpartial")]
        public async Task<IActionResult> GetPartial([FromQuery] string id)
        {
            var post = _context.Post.Select(x => new {
                x.Id, x.PubDate, x.AuthorInfo, x.Description, x.Thumbnail, x.Tags
            }).FirstOrDefault(x => x.Id == id);

            if (post != null)
            {
                return Ok(post);
            }
            else
            {
                return BadRequest("Invalid id.");
            }
        }

        [Authorize(Roles = "admin")]
        [ValidateAntiForgeryToken]
        [HttpPost("add")]
        public async Task<IActionResult> Create([FromForm] string title, [FromForm] string thumbnail, [FromForm] string description,
            [FromForm] int[] tagIds, [FromForm] IFormFile[] imageFiles, [FromForm] string[] imageUrls)
        {
            var post = new Post()
            {
                Title = title,
                Thumbnail = thumbnail,
                Description = description
            };

            await post.Initialize(_context, tagIds, imageFiles, imageUrls, User);

            ModelState.Clear();
            TryValidateModel(post);

            if (ModelState.IsValid)
            {
                _context.Add(post);
                await _context.SaveChangesAsync();

                return Ok(new { title = post.Title, id = post.Id });
            }

            return BadRequest();
        }

        [Authorize(Roles = "admin")]
        [ValidateAntiForgeryToken]
        [HttpPost("update")]
        public async Task<IActionResult> Update([FromForm] string title, [FromForm] string thumbnail, [FromForm] string description,
            [FromForm] string id, [FromForm] int[] tagIds, [FromForm] IFormFile[] imageFiles, [FromForm] string[] imageUrls)
        {
            var post = new Post() 
            {  
                Id = id,
                Title = title,
                Thumbnail = thumbnail,
                Description = description
            };

            var postToUpdate = _context.Post.Include(x => x.Author).Include(x => x.Tags).FirstOrDefault(x => x.Id == post.Id);

            ModelState.Clear();
            TryValidateModel(postToUpdate);

            if (ModelState.IsValid)
            {
                try
                {
                    await postToUpdate.Update(_context, post, tagIds, imageFiles, imageUrls);
                    await _context.SaveChangesAsync();

                    return Ok(new { description = postToUpdate.Description });
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!_context.Post.Any(x => x == postToUpdate))
                    {
                        return BadRequest();
                    }

                    return Ok();
                }
            }

            return BadRequest();
        }

        [Authorize(Roles = "admin")]
        [ValidateAntiForgeryToken]
        [HttpDelete("delete-items")]
        public async Task<IActionResult> DeletePosts([FromBody] string[] idArray)
        {
            foreach (var id in idArray)
            {
                var post = _context.Post.Include(p => p.Tags).FirstOrDefault(x => x.Id == id);

                if (post != null)
                {
                    post.Destruct(_context);
                }
            }

            await _context.SaveChangesAsync();
            return Ok();
        }


        [Authorize(Roles = "admin")]
        [ValidateAntiForgeryToken]
        [HttpDelete("delete-item")]
        public async Task<IActionResult> DeletePost([FromQuery] string id)
        {
            var post = _context.Post.Include(p => p.Tags).FirstOrDefault(x => x.Id == id);

            if (post != null)
            {
                post.Destruct(_context);

                await _context.SaveChangesAsync();
                return Ok();
            }

            return BadRequest();
        }

        [HttpGet("show-post")]
        public async Task<IActionResult> ShowPost([FromQuery] string id)
        {
            var post = await _context.Post.Include(x => x.Author).Include(x => x.Tags)
                .FirstOrDefaultAsync(x => x.Id == id);

            var rate = await _context.RatingChoice
                .FirstOrDefaultAsync(x => x.User.UserName == User.Identity.Name
                                     && x.PostId == id);

            return post != null ? Ok(new { post, isLiked = rate?.IsLiked }) : BadRequest();
        }

        [HttpPost("rate")]
        public async Task<IActionResult> Rate([FromBody] PostRating postRating)
        {
            var post = await _context.Post.FirstOrDefaultAsync(x => x.Id == postRating.PostId);

            var user = await _context.User.Include(x => x.RatingChoices)
                .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);

            var ratingChoice = _context.RatingChoice.FirstOrDefault(x => x.User == user 
                                                                    && x.PostId == post.Id);

            if (post != null && user != null)
            {
                post.Rating += postRating.Value;

                if (ratingChoice != null)
                {
                    _context.Remove(ratingChoice);
                    ratingChoice = null;
                }

                //If rating choice wasn't neutral.
                if (postRating?.IsLiked != null)
                {
                    ratingChoice = new RatingChoice()
                    {
                        IsLiked = postRating.IsLiked,
                        PostId = postRating.PostId,
                        User = user,
                        UserId = user.Id
                    };

                    user.RatingChoices.Add(ratingChoice);
                }

                await _context.SaveChangesAsync();
                return Ok();
            }

            return StatusCode(401);
        }
    }
}
