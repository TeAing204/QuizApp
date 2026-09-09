using System.ComponentModel.DataAnnotations;

namespace QuizApp.WebAPI.Models.DTOs.Common
{
    /// <summary>
    /// DTO để gán câu hỏi vào quiz (admin).
    /// </summary>
    public class QuizQuestionCreateDto
    {
        [Required]
        public Guid QuizId { get; set; }

        [Required]
        public Guid QuestionId { get; set; }
    }

    /// <summary>
    /// DTO cho mỗi câu trả lời trong submission.
    /// </summary>
    public class UserAnswerSubmissionDto
    {
        [Required]
        public Guid QuestionId { get; set; }

        [Required]
        public Guid AnswerId { get; set; }
    }
}
