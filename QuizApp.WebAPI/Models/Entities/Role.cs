using System.ComponentModel.DataAnnotations;

namespace QuizApp.WebAPI.Models.Entities
{
    // Một Role có thể được gán cho nhiều User.
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

        public ICollection<User> Users { get; set; } = new List<User>();
    }
}
