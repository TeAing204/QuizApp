using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuizApp.WebAPI.Models.Entities
{
    // Lưu thông tin mỗi lần user làm một quiz.
    // Mỗi QuizAttempt thuộc đúng một User và một Quiz.
    public class QuizAttempt
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        // FK: User
        [Required]
        public Guid UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        // FK: Quiz
        [Required]
        public Guid QuizId { get; set; }

        [ForeignKey("QuizId")]
        public Quiz Quiz { get; set; } = null!;

        // Mã code dùng để vào thi.
        [MaxLength(50)]
        public string? QuizCode { get; set; }

        public DateTime StartTime { get; set; } = DateTime.UtcNow;

        public DateTime? SubmittedAt { get; set; }

        // Điểm số sau khi chấm (0-100).
        public decimal? Score { get; set; }

        // Navigation: QuizAttempt → Nhiều UserAnswer
        public ICollection<UserAnswer> UserAnswers { get; set; } = new List<UserAnswer>();
    }
}
