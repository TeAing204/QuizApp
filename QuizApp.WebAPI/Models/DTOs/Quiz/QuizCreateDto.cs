using System.ComponentModel.DataAnnotations;

namespace QuizApp.WebAPI.Models.DTOs.Quiz
{
    public class QuizCreateDto
    {
        [Required] [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Required] [Range(1, 300, ErrorMessage = "Duration must be between 1 and 300 minutes")]
        public int Duration { get; set; }

        public bool IsActive { get; set; } = true;

        [MaxLength(500)]
        public string? ThumbnailUrl { get; set; }
    }
}
