using System.ComponentModel.DataAnnotations;

namespace QuizApp.WebAPI.Models.Entities
{
    /// <summary>
    /// Bài quiz trong hệ thống.
    /// Một Quiz có thể chứa nhiều Question thông qua bảng trung gian QuizQuestion.
    /// </summary>
    public class Quiz
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        /// <summary>
        /// Thời gian làm bài (đơn vị: phút).
        /// </summary>
        [Required]
        public int Duration { get; set; }

        [MaxLength(500)]
        public string? ThumbnailUrl { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation: Quiz → Nhiều QuizQuestion (Many-to-Many với Question)
        public ICollection<QuizQuestion> QuizQuestions { get; set; } = new List<QuizQuestion>();

        // Navigation: Quiz → Nhiều QuizAttempt
        public ICollection<QuizAttempt> QuizAttempts { get; set; } = new List<QuizAttempt>();
    }
}
