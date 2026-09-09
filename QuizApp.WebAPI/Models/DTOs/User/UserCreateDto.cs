using System.ComponentModel.DataAnnotations;

namespace QuizApp.WebAPI.Models.DTOs.User
{
    /// <summary>
    /// DTO cho admin tạo user mới.
    /// </summary>
    public class UserCreateDto
    {
        [Required] [MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required] [MaxLength(50)]
        public string LastName { get; set; } = string.Empty;

        [Required] [EmailAddress] [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required] [MaxLength(50)]
        public string UserName { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [Required] [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        [Required] [Compare("Password", ErrorMessage = "Passwords do not match")]
        public string ConfirmPassword { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        /// <summary>
        /// Admin chọn role khi tạo user. Nếu không truyền, mặc định là role User.
        /// </summary>
        public Guid? RoleId { get; set; }
    }
}
