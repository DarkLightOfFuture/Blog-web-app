using Azure.Identity;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace aspAppAngular.Server.Models
{
	public class ChangePassword
	{
		public string CurrentPassword { get; set; }
		public string NewPassword { get; set; }
	}

	public class ChangeProfile
	{
		public string Username { get; set; }
        public string? PhoneNumber { get; set; }
		public IFormFile? Avatar { get; set; }
    }

	public class ChangeRoles
	{
		public string[] ordinaryUsers { get; set; }
		public string[] admins { get; set; }
	}

	public class ChangeEmail
	{
		public string NewEmail { get; set; }
		public string? Token { get; set; }
	}

	public class Register
	{
		public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string NewPassword { get; set; }

    }

	public class ResetPassword
	{
		public string Email { get; set; }
        public string Token { get; set; }
        public string Password { get; set; }
    }
}
