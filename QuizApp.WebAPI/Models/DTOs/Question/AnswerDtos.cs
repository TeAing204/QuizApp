using System.ComponentModel.DataAnnotations;

namespace QuizApp.WebAPI.Models.DTOs.Question
{
    /// <summary>
    /// DTO hiển thị đáp án đầy đủ (cho admin quản lý, CÓ isCorrect).
    /// </summary>
    public class AnswerViewModel
    {
        public Guid Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
        public bool IsActive { get; set; }
        public Guid QuestionId { get; set; }
    }

    public class AnswerCreateDto
    {
        [Required] [MaxLength(1000)]
        public string Content { get; set; } = string.Empty;

        public bool IsCorrect { get; set; } = false;
        public bool IsActive { get; set; } = true;

        [Required]
        public Guid QuestionId { get; set; }
    }

    public class AnswerEditDto
    {
        [Required]
        public Guid Id { get; set; }

        [Required] [MaxLength(1000)]
        public string Content { get; set; } = string.Empty;

        public bool IsCorrect { get; set; } = false;
        public bool IsActive { get; set; } = true;

        [Required]
        public Guid QuestionId { get; set; }
    }
}
