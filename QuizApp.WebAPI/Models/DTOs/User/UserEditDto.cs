using System.ComponentModel.DataAnnotations;

namespace QuizApp.WebAPI.Models.DTOs.User
{
    // DTO cho admin cập nhật user.
    // Không cho phép sửa password qua endpoint này.
    public class UserEditDto
    {
        [Required]
        public Guid Id { get; set; }

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

        public bool IsActive { get; set; } = true;

        // Admin có thể đổi role cho user.
        public Guid? RoleId { get; set; }
    }
}
