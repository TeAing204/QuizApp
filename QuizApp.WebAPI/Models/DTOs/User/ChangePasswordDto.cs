using System.ComponentModel.DataAnnotations;

namespace QuizApp.WebAPI.Models.DTOs.User
{
    // DTO cho chức năng đổi mật khẩu.
    public class ChangePasswordDto
    {
        [Required]
        public string OldPassword { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; } = string.Empty;

        [Required]
        [Compare("NewPassword")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
