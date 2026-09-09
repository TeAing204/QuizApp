using System.ComponentModel.DataAnnotations;

namespace QuizApp.WebAPI.Models.Entities
{
    /// <summary>
    /// Vai trò người dùng trong hệ thống (VD: User, Administrator).
    /// Một Role có thể được gán cho nhiều User.
    /// </summary>
    public class Role
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation: Một Role → Nhiều User
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}
