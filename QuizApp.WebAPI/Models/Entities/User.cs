using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuizApp.WebAPI.Models.Entities
{
    // Mỗi User thuộc đúng một Role.
    public class User
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string LastName { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? DisplayName { get; set; }

        [Required]
        [MaxLength(100)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string UserName { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [MaxLength(500)]
        public string? Avatar { get; set; }

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // FK: Mỗi User thuộc đúng một Role
        [Required]
        public Guid RoleId { get; set; }

        [ForeignKey("RoleId")]
        public Role Role { get; set; } = null!;

        // Navigation: Một User → Nhiều QuizAttempt
        public ICollection<QuizAttempt> QuizAttempts { get; set; } = new List<QuizAttempt>();
    }
}
