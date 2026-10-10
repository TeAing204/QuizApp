using System.ComponentModel.DataAnnotations;

namespace QuizApp.WebAPI.Models.DTOs.Question
{
    // DTO đơn giản cho đáp án khi tạo inline cùng câu hỏi.
    // Không cần QuestionId vì sẽ tự gán trong service.
    public class AnswerCreateInlineDto
    {
        [Required] [MaxLength(1000)]
        public string Content { get; set; } = string.Empty;

        public bool IsCorrect { get; set; } = false;
        public bool IsActive { get; set; } = true;
    }

    public class QuestionCreateDto
    {
        [Required] [MaxLength(2000)]
        public string Content { get; set; } = string.Empty;

        [Required]
        public string QuestionType { get; set; } = "SingleChoice";

        public bool IsActive { get; set; } = true;

        // Danh sách đáp án tạo kèm (optional). 
        public List<AnswerCreateInlineDto>? Answers { get; set; }
    }

    public class QuestionEditDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required] [MaxLength(2000)]
        public string Content { get; set; } = string.Empty;

        [Required]
        public string QuestionType { get; set; } = "SingleChoice";

        public bool IsActive { get; set; } = true;
    }
}
