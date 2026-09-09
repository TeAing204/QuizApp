using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuizApp.WebAPI.Models.Entities
{
    /// <summary>
    /// Lưu câu trả lời của user cho từng câu hỏi trong một lần thi.
    /// Mỗi UserAnswer thuộc một QuizAttempt, tham chiếu đến Question và Answer đã chọn.
    /// </summary>
    public class UserAnswer
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        // FK: QuizAttempt
        [Required]
        public Guid QuizAttemptId { get; set; }

        [ForeignKey("QuizAttemptId")]
        public QuizAttempt QuizAttempt { get; set; } = null!;

        // FK: Question (câu hỏi nào)
        [Required]
        public Guid QuestionId { get; set; }

        [ForeignKey("QuestionId")]
        public Question Question { get; set; } = null!;

        // FK: Answer (đáp án đã chọn)
        [Required]
        public Guid AnswerId { get; set; }

        [ForeignKey("AnswerId")]
        public Answer Answer { get; set; } = null!;
    }
}
