using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using aspAppAng.Server.Data;
using aspAppAngular.Server.Models;
using Microsoft.AspNetCore.Authorization;

namespace aspAppAng.Server.Controllers
{
    [ApiController]
    [Route("[controller]/api/")]
    public class TagsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public TagsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("get-items")]
        public async Task<IActionResult> GetItems([FromQuery] string? arg, [FromQuery] string? type, [FromQuery] int? count)
        {
            var query = _context.Tag.AsQueryable();
            var isIndexDefault = arg == "null" && type == "null";

            if (!isIndexDefault && !string.IsNullOrEmpty(arg) && !string.IsNullOrEmpty(type))
            {
                if (type == "name")
                {
                    query = query.Where(x => x.Name.Contains(arg));
                }
                else if (type == "id")
                {
                    query = query.Where(x => x.Id.ToString().Contains(arg));
                }
            }

            query = query.Take(count ?? 10);

            return Ok(query.ToArray());
        }

        [Authorize()]
        [ValidateAntiForgeryToken]
        [HttpPost("add")]
        public async Task<IActionResult> Create([FromBody] Tag tag)
        {
            TryValidateModel(tag);

            if (ModelState.IsValid)
            {
                var isIndex = tag.Count == 0 ? false : true;

                if (isIndex)
                {
                    tag.Count = 0;
                }

                await _context.Tag.AddAsync(tag);
                await _context.SaveChangesAsync();

                return !isIndex ?
                    Ok(tag.Id) :
                    Ok(new { tag.Id, tag.Name });
            }

            return BadRequest();
        }

        [Authorize(Roles = "admin")]
        [ValidateAntiForgeryToken]
        [HttpPost("update")]
        public async Task<IActionResult> Update([FromBody] Tag tag)
        {
            var updatedTag = await _context.Tag.FirstOrDefaultAsync(x => x.Id == tag.Id);

            if (updatedTag != null)
            {
                if (updatedTag.Name != tag.Name)
                {
                    updatedTag.Name = tag.Name;
                    await _context.SaveChangesAsync();

                    return Ok();
                }
                else
                {
                    return Ok();
                }
            }

            return BadRequest();
        }

        [HttpGet("isunique")]
        public async Task<IActionResult> IsUnique([FromQuery] string name)
        {
            var val = !_context.Tag.Any(x => x.Name == name);

            return val ? Ok() :
                BadRequest();
        }

        [Authorize(Roles = "admin")]
        [ValidateAntiForgeryToken]
        [HttpDelete("delete-items")]
        public async Task<IActionResult> DeleteTags([FromBody] int[] idArray)
        {
            foreach (var id in idArray)
            {
                var tag = _context.Tag.FirstOrDefault(x => x.Id == id);

                if (tag != null)
                {
                    _context.Remove(tag);
                }
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        [Authorize(Roles = "admin")]
        [ValidateAntiForgeryToken]
        [HttpDelete("delete-item")]
        public async Task<IActionResult> DeleteTag([FromQuery] int id)
        {
            var tag = _context.Tag.FirstOrDefault(x => x.Id == id);

            if (tag != null)
            {
                _context.Remove(tag);

                await _context.SaveChangesAsync();
                return Ok();
            }

            return BadRequest();
        }
    }
}
