using QuizApp.WebAPI.Models.DTOs.Common;

namespace QuizApp.WebAPI.Models.DTOs.Quiz
{
    /// <summary>
    /// DTO cho request nộp bài quiz.
    /// </summary>
    public class QuizSubmissionDto
    {
        public Guid QuizId { get; set; }
        public Guid UserId { get; set; }
        public string? QuizCode { get; set; }

        /// <summary>
        /// Danh sách câu trả lời user đã chọn.
        /// </summary>
        public List<UserAnswerSubmissionDto> Answers { get; set; } = new();
    }
}
