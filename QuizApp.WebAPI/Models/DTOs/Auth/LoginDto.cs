using System.ComponentModel.DataAnnotations;

namespace QuizApp.WebAPI.Models.DTOs.Auth
{
    /// <summary>
    /// DTO cho request đăng nhập.
    /// </summary>
    public class LoginDto
    {
        [Required(ErrorMessage = "Username is required")]
        public string UserName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; } = string.Empty;
    }
}
