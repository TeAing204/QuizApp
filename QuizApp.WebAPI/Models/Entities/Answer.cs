using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuizApp.WebAPI.Models.Entities
{
    /// <summary>
    /// Đáp án của một câu hỏi.
    /// Mỗi Answer thuộc đúng một Question.
    /// </summary>
    public class Answer
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(1000)]
        public string Content { get; set; } = string.Empty;

        /// <summary>
        /// Đánh dấu đáp án đúng.
        /// </summary>
        public bool IsCorrect { get; set; } = false;

        public bool IsActive { get; set; } = true;

        // FK: Mỗi Answer thuộc đúng một Question
        [Required]
        public Guid QuestionId { get; set; }

        [ForeignKey("QuestionId")]
        public Question Question { get; set; } = null!;
    }
}
