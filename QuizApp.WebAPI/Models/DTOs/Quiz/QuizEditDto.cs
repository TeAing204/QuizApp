using System.ComponentModel.DataAnnotations;

namespace QuizApp.WebAPI.Models.DTOs.Quiz
{
    public class QuizEditDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required] [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Required] [Range(1, 300)]
        public int Duration { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
