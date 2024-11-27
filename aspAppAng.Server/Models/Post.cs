using aspAppAng.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics;
using System.Security.Claims;

namespace aspAppAngular.Server.Models
{
    public class Post
    {
        public string Id { get; set; }
        [MaxLength(110)]
        public string Title { get; set; }
        [MaxLength(2000)]
        public string Thumbnail { get; set; }
        [MaxLength(100000)]
        public string Description { get; set; }
        public DateTime PubDate { get; set; }
		public int Rating { get; set; } = 0;
		public string fullInfo => string.Format($"{Id} | {Title}");
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<Tag> Tags { get; set; } = new List<Tag>();
        public ICollection<RatingChoice> RatingChoices { get; set; } = new List<RatingChoice>();
        public string AuthorInfo { get; set; }
        public string AuthorId { get; set; }
        [ForeignKey("AuthorId")]
		public ApplicationUser Author { get; set; }

        public async Task Initialize(ApplicationDbContext context, int[] tagsList,
            IFormFile[] imageFiles, string[] imageUrls, ClaimsPrincipal User)
        {
            //Id
            var text = String.Join("-", Title.Split(" "));

            var i = 0;
            while (1 == 1)
            {
                i++;

                if (context.Post.FirstOrDefault(x => x.Id == Uri.EscapeDataString(text + i.ToString())) == null)
                {
                    Id = Uri.EscapeDataString(text + i.ToString());
                    break;
                }
            }

            //Comments, PubDate, Description,
            Comments = await context.Comment.Where(x => x.PostId == Id).ToListAsync();
            Description = await AddImages(this.Description, imageFiles, imageUrls);
            PubDate = DateTime.Now;

            //Author
            var user = context.User.First(x => x.UserName == User.Identity.Name);
            Author = user;
            AuthorInfo = $"{user.FirstName} {user.LastName}";
            AuthorId = user.Id;

            //Tags
            foreach (var id in tagsList)
            {
                var tag = await context.Tag.FirstAsync(x => x.Id == id);
                ++tag.Count;
                Tags.Add(tag);
            }
        }

        public void Destruct(ApplicationDbContext context)
        {
            //Resets tags.
            foreach (var tag in Tags)
            {
                --tag.Count;
            }

            DeleteImages(Description);
            context.Remove(this);
        }

        public async Task Update(ApplicationDbContext context, Post post, int[] tagsList,
            IFormFile[] imageFiles, string[] imageUrls)
        {
            Description = await AddImages(post.Description, imageFiles, imageUrls);

            if (post.Thumbnail != Thumbnail)
            {
                Thumbnail = post.Thumbnail;
            }

            if (post.Title != Title)
            {
                Title = post.Title;
            }

            //Deletes old tags and adds new ones.
            foreach (var tag in Tags.ToList())
            {
                if (!tagsList.Contains(tag.Id))
                {
                    Tags.First(x => x == tag).Count--;
                    Tags.Remove(tag);
                }
            }

            foreach (var tagId in tagsList)
            {
                var tag = Tags.FirstOrDefault(x => x.Id == tagId);

                if (tag == null)
                {
                    tag = context.Tag.FirstOrDefault(x => x.Id == tagId);

                    if (tag != null)
                    {
                        Tags.Add(tag);
                        tag.Count++;
                    }
                }
            }

            context.Update(this);
        }

        /// <summary>
        /// Adds images on server and then changes imgs' src with image path on server.
        /// </summary>
        /// <param name="description">Post's description</param>
        /// <returns>Post description with uploaded images.</returns>
        private async Task<string> AddImages(string description, IFormFile[] imageFiles, string[] imageUrls)
        {
            const string pathBeginning = "./wwwroot/postImages/";

            foreach (var imageFile in imageFiles)
            {
                var imgName = Utilities.RandomName.Create(10, pathBeginning);
                var path = pathBeginning + imgName + ".jpg";

                Utilities.File.Upload(imageFile, path);

                var ind = description.IndexOf("<img src=\"blob:");
                var ind2 = description.Substring(ind).IndexOf(">") + ind;

                var newImg = $"<img src=\"postImages/{imgName}.jpg\">";
                description = description.Replace(description.Substring(ind, ind2 - ind + 1), newImg);
            }

            foreach (var imageUrl in imageUrls)
            {
                try
                {
                    string imgName = Utilities.RandomName.Create(10, pathBeginning),
                        path = pathBeginning + imgName + ".jpg";

                    Utilities.File.Upload(imageUrl, path);

                    description = description.Replace(imageUrl.Replace("&", "&amp;"), $"postImages/{imgName}.jpg");
                }
                catch (Exception ex) { }
            }

            return description;
        }

        /// <summary>
        /// Deletes Post's images.
        /// </summary>
        /// <param name="description">Post's description</param>
        private void DeleteImages(string description)
        {
            const string pathBeginning = "./wwwroot/";

            int fInd = -2,
                lInd = -2;

            while (fInd - 10 != -1)
            {
                fInd = description.IndexOf("<img src=") + 10;

                if (fInd - 10 != -1)
                {
                    description = description.Substring(fInd);
                    lInd = description.IndexOf('"');

                    if (lInd != -1)
                    {
                        var fullPath = $"{pathBeginning}{description.Substring(0, lInd)}";
                        Utilities.File.Remove(fullPath);

                        description = description.Substring(lInd + 1);
                    }
                }
            }
        }
    }

    public class PostRating
    {
        public int Value { get; set; }
        public string PostId { get; set; }
        public bool? IsLiked { get; set; }
    }
}
