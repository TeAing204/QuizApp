using System.ComponentModel.DataAnnotations;

namespace QuizApp.WebAPI.Models.DTOs.Quiz
{
    // DTO để gán câu hỏi vào quiz (admin).
    public class QuizQuestionCreateDto
    {
        [Required]
        public Guid QuizId { get; set; }

        [Required]
        public Guid QuestionId { get; set; }
    }

    // DTO cho mỗi câu trả lời trong submission.
    public class UserAnswerSubmissionDto
    {
        [Required]
        public Guid QuestionId { get; set; }

        [Required]
        public Guid AnswerId { get; set; }
    }
}
