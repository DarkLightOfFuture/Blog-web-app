using aspAppAng.Server.Data;
using aspAppAng.Server.Services.mail;
using aspAppAngular.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Dynamic;
using System.Text.RegularExpressions;
using aspAppAng.Server.Models;
using System.Web;
using Microsoft.AspNetCore.Antiforgery;
using Newtonsoft.Json;

namespace aspAppAng.Server.Controllers
{
    [ApiController]
	[Route("[controller]/api/")]
	public class UserController : Controller
	{
		private static ApplicationDbContext _context;
		private readonly UserManager<ApplicationUser> _userManager;
		private readonly SignInManager<ApplicationUser> _signInManager;
		private readonly RoleManager<IdentityRole> _roleManager;
		private readonly IMailService _mailService;
		private readonly IAntiforgery _antiforgery;
		private readonly IHttpContextAccessor _httpContext;

		public UserController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, 
			SignInManager<ApplicationUser> signInManager, RoleManager<IdentityRole> roleManager,
			IMailService mailService, IAntiforgery antiforgery, IHttpContextAccessor httpContext)
		{
			_context = context;
			_userManager = userManager;
			_signInManager = signInManager;
			_roleManager = roleManager;
			_mailService = mailService;
			_antiforgery = antiforgery;
			_httpContext = httpContext;
		}

		[HttpGet("login")]
		public async Task<IActionResult> Login([FromQuery] string email, [FromQuery] string password, [FromQuery] bool rememberMe)
		{
			var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Email == email);

			if (user != null)
			{
				var result = await _signInManager.PasswordSignInAsync(user, password, rememberMe, false);

				if (result.Succeeded)
				{
					return Ok(new {
						username = user.UserName,
						avatar = user.Avatar,
						email = user.Email,
						phoneNumber = user.PhoneNumber,
						hasAdmin = await _userManager.IsInRoleAsync(user, "admin")
					});
				}
				else
				{
					return BadRequest("Invalid login.");
				}
            }

            return BadRequest("Invalid login.");
        }

		[HttpDelete("logout")]
		public async Task<IActionResult> LogOut()
		{
            await _signInManager.SignOutAsync();
			return Ok();
        }

		[HttpGet("get-antiforgery-token")]
		public async Task<IActionResult> GetAntiforgeryToken()
		{
			return Ok(JsonConvert.SerializeObject(_antiforgery.GetAndStoreTokens(_httpContext.HttpContext).RequestToken));
		}

		//Account management

		[HttpPost("change-password")]
		[Authorize]
		public async Task<IActionResult> ChangePassword([FromBody] ChangePassword model)
		{
			if (IsPasswordValid(model.NewPassword))
			{
                var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
                var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);

				if (!result.Succeeded)
				{
                    return BadRequest("Incorrect password.");
				}

                return Ok();
            }

			return BadRequest();
		}

		[HttpPost("change-profile")]
		[Authorize]
		public async Task<IActionResult> ChangeProfile([FromForm] ChangeProfile model)
		{
            var user = await _context.User.FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
			dynamic changes = new ExpandoObject();

			//Changes phone number
			if (model.PhoneNumber != "null" && user.PhoneNumber != model.PhoneNumber)
			{
				var pattern = new Regex(@"^\+\d{11}$");

				if (pattern.IsMatch(model.PhoneNumber))
				{
					user.PhoneNumber = changes.phoneNumber = model.PhoneNumber;
					await _context.SaveChangesAsync();
				}
				else
				{
					return BadRequest();
				}
			}

			//Changes username
			if (user.UserName != model.Username)
			{
				var isNotUnique = _context.User.Any(x => x.UserName == model.Username.ToLower());

				if (isNotUnique && !IsUsernameValid(model.Username))
				{
					return BadRequest("The username is not unique.");
				}
				else
				{
					user.UserName = changes.username = model.Username.ToLower();
					await _context.SaveChangesAsync();
					await _signInManager.RefreshSignInAsync(user);
				}
			}

			//Changes avatar
			if (model.Avatar != null)
			{
				const string pathBeginning = "./wwwroot/avatars/";
				var avatarName = Utilities.RandomName.Create(10, pathBeginning);
				var path = pathBeginning + avatarName + ".jpg";

				using (var stream = System.IO.File.Create(path))
				{
					await model.Avatar.CopyToAsync(stream);
				}

				//Deletes old avatar if exists
				if (user.Avatar != "/avatars/defaultAvatar.jpg")
				{
					System.IO.File.Delete("./wwwroot/avatars/" + user.Avatar.Split("/")[2]);
				}

				user.Avatar = changes.avatar = "/avatars/" + avatarName + ".jpg";
				await _context.SaveChangesAsync();
			}

			return Ok(changes);
		}

		[Authorize(Roles = "admin")]
		[HttpGet("get-users")]
		public async Task<IActionResult> GetUsers()
		{
			var admins = _userManager.GetUsersInRoleAsync("admin")
				.GetAwaiter().GetResult()
				.Select(x => x.UserName).ToArray();
			
			var users = _userManager.Users.Select(x => x.UserName).ToList();

			//Delete users with admin role.
			foreach (var admin in admins)
			{
				if (users.Contains(admin))
				{
					users.Remove(admin);
				}
			}

			return Ok(new { ordinaryUsers = users, admins });
		}

        [Authorize(Roles = "admin")]
        [HttpPost("change-roles")]
        public async Task<IActionResult> ChangeRoles([FromBody] ChangeRoles model)
        {
            foreach (var username in model.ordinaryUsers.ToArray())
            {
                var user = await _userManager.FindByNameAsync(username);

                if (user != null)
                {
                    var isAdmin = await _userManager.IsInRoleAsync(user, "admin");

                    if (isAdmin)
                    {
                        await _userManager.RemoveFromRoleAsync(user, "admin");
                    }
                }
            }

            foreach (var username in model.admins.ToArray())
            {
                var user = await _userManager.FindByNameAsync(username);

                if (user != null)
                {
                    var isAdmin = await _userManager.IsInRoleAsync(user, "admin");

                    if (!isAdmin)
                    {
                        await _userManager.AddToRoleAsync(user, "admin");
                    }
                }
            }

            return Ok();
        }

		[Authorize]
		[HttpPost("change-email")]
        public async Task<IActionResult> ChangeEmail([FromBody] ChangeEmail model)
		{
			if (IsEmailValid(model.NewEmail))
			{
				var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
				var token = await _userManager.GenerateChangeEmailTokenAsync(user, model.NewEmail.ToLower());

				var qParams = new Dictionary<string, string>();
				qParams.Add("token", token);
                qParams.Add("new-email", model.NewEmail.ToLower());

                var result = SendMail(model.NewEmail.ToLower(), "Change email - confirmation", "Click this link to confirm",
					"https://localhost:4200/confirm-email-change", qParams.Keys.ToArray(), qParams.Values.ToArray());

                return result ? Ok() : BadRequest();
			}

            return BadRequest();
		}

		[Authorize]
		[HttpPost("confirm-email-change")]
		public async Task<IActionResult> ConfirmEmailChange([FromBody] ChangeEmail model)
		{
            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);

            var result = await _userManager.ChangeEmailAsync(user, model.NewEmail.ToLower(), model.Token);
			return result.Succeeded ? Ok() : BadRequest();
		}

		[HttpPost("register")]
		public async Task<IActionResult> Register([FromBody] Register model)
		{
			if (IsEmailValid(model.Email) && IsUsernameValid(model.Username)
				&& IsPasswordValid(model.NewPassword))
			{
				var isNotUnique = _context.User.Any(x => x.UserName == model.Username.ToLower());

				if (!isNotUnique)
				{
					var user = new ApplicationUser()
					{
						FirstName = model.FirstName,
						LastName = model.LastName,
						UserName = model.Username.ToLower(),
						Email = model.Email.ToLower()
					};

					var isUsedEmail = _userManager.Users.Any(x => x.Email == user.Email);

					if (!isUsedEmail)
					{
                        var result = await _userManager.CreateAsync(user, model.NewPassword);

                        if (result.Succeeded)
                        {
							var isSuccess = await SendEmailConfirmation(user);

                            if (!isSuccess)
                            {
                                await _userManager.DeleteAsync(user);
                                return BadRequest("Invalid email.");
                            }

                            return Ok();
                        }
                    }
					else
					{
                        return BadRequest("Invalid email.");
                    }
				}
				else
				{
					return BadRequest("The username is not unique.");
				}
			}

			return BadRequest();
		}

        [HttpPost("resend-email-confirmation")]
        public async Task<IActionResult> ResendEmailConfirmation([FromBody] ChangeEmail model)
        {
            var user = await _userManager.FindByEmailAsync(model.NewEmail);

            if (user != null && !user.EmailConfirmed)
            {
				await SendEmailConfirmation(user);
            }

            return Ok();
        }

		private async Task<bool> SendEmailConfirmation(ApplicationUser user)
		{
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

            var qParams = new Dictionary<string, string>();
            qParams.Add("token", token);
            qParams.Add("email", user.Email);

            return SendMail(user.Email, "Email - confirmation", "Click this link to confirm",
                "https://localhost:4200/confirm-email", qParams.Keys.ToArray(), qParams.Values.ToArray());
        }

        [HttpPost("confirm-email")]
		public async Task<IActionResult> ConfirmEmail([FromBody] ChangeEmail model)
		{
			var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Email == model.NewEmail);

			if (user != null)
			{
				var result = await _userManager.ConfirmEmailAsync(user, model.Token);

				return result.Succeeded ? Ok() : BadRequest();
			}

			return BadRequest();
		}

			//Resets password.

		[HttpPost("forgot-password")]
		public async Task<IActionResult> ForgotPassword([FromBody] ChangeEmail model)
		{
			var user = await _userManager.FindByEmailAsync(model.NewEmail);

			if (user != null)
			{
				var token = await _userManager.GeneratePasswordResetTokenAsync(user);

				var qParams = new Dictionary<string, string>();
				qParams.Add("token", token);
                qParams.Add("email", user.Email);

                SendMail(user.Email, "Reset password", "Click this link to reset your password", 
					"https://localhost:4200/reset-password", qParams.Keys.ToArray(), qParams.Values.ToArray());
            }

			return Ok();
		}

		[HttpPost("reset-password")]
		public async Task<IActionResult> ResetPassword([FromBody] ResetPassword model)
		{
			var user = await _userManager.FindByEmailAsync(model.Email);

			if (user != null)
			{
				var result = await _userManager.ResetPasswordAsync(user, model.Token, model.Password);
				
				return result.Succeeded ? Ok() : BadRequest();
			}

			return BadRequest();
		}

		//Email sender

		private bool SendMail(string email, string subject, string body, 
			string rawUrl, string[] keys, string[] values)
		{
			var url = new UriBuilder(rawUrl);
			var query = HttpUtility.ParseQueryString(url.Query);

			for (var i = 0; i < keys.Length; i++)
			{
				query[ keys[i] ] = values[i];
			}

			url.Query = query.ToString();
			rawUrl = url.ToString();

			return _mailService.SendMail(new MailData()
			{
				ToEmail = email,
				EmailSubject = subject,
				EmailBody = $"{body}: {rawUrl}",
			});
		}

			//Validation

        private bool IsEmailValid(string email)
		{
            var pattern = new Regex(@"^[\w\+\-~\!\#\$\'\.\/=\^`\{\}\|]+@[a-zA-Z]+\.[a-zA-Z]+$");

			return pattern.IsMatch(email);
        }

		private bool IsUsernameValid(string username)
		{
			var pattern = new Regex(@"^[\w\+\-~\!\#\$\.\^]{5,30}$");

			return pattern.IsMatch(username);
		}

		private bool IsPasswordValid(string password)
		{
			var pattern = new Regex(@"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[`!@#$%^&*()_+\-=\[\]{};':""\\|,.<>\/?~]).{6,100}$");

            return pattern.IsMatch(password);
        }
    }
}
