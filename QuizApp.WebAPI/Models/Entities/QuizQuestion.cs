using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuizApp.WebAPI.Models.Entities
{
    // Bảng trung gian cho quan hệ Many-to-Many giữa Quiz và Question.
    // Cho phép một câu hỏi được dùng trong nhiều quiz (question bank).
    public class QuizQuestion
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        // FK: Quiz
        [Required]
        public Guid QuizId { get; set; }

        [ForeignKey("QuizId")]
        public Quiz Quiz { get; set; } = null!;

        // FK: Question
        [Required]
        public Guid QuestionId { get; set; }

        [ForeignKey("QuestionId")]
        public Question Question { get; set; } = null!;
    }
}
