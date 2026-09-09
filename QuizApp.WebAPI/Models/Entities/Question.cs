using System.ComponentModel.DataAnnotations;
using QuizApp.WebAPI.Models.Enums;

namespace QuizApp.WebAPI.Models.Entities
{
    /// <summary>
    /// Câu hỏi trong ngân hàng câu hỏi.
    /// Một Question có thể thuộc nhiều Quiz (thông qua QuizQuestion)
    /// và có nhiều Answer.
    /// </summary>
    public class Question
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(2000)]
        public string Content { get; set; } = string.Empty;

        [Required]
        public QuestionType QuestionType { get; set; } = QuestionType.SingleChoice;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation: Question → Nhiều Answer
        public ICollection<Answer> Answers { get; set; } = new List<Answer>();

        // Navigation: Question → Nhiều QuizQuestion (Many-to-Many với Quiz)
        public ICollection<QuizQuestion> QuizQuestions { get; set; } = new List<QuizQuestion>();
    }
}
