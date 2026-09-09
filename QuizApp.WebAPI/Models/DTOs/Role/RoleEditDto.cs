using System.ComponentModel.DataAnnotations;

namespace QuizApp.WebAPI.Models.DTOs.Role
{
    public class RoleEditDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required] [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
