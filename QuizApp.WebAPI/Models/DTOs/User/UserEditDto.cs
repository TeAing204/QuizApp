using System.ComponentModel.DataAnnotations;

namespace QuizApp.WebAPI.Models.DTOs.User
{
    /// <summary>
    /// DTO cho admin cập nhật user.
    /// Lưu ý: Không cho phép sửa password qua endpoint này (theo yêu cầu tài liệu).
    /// </summary>
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

        /// <summary>
        /// Admin có thể đổi role cho user.
        /// </summary>
        public Guid? RoleId { get; set; }
    }
}
