namespace QuizApp.WebAPI.Models.DTOs.Quiz
{
    // DTO cho request nộp bài quiz.
    public class QuizSubmissionDto
    {
        public Guid QuizId { get; set; }
        public Guid UserId { get; set; }
        public string? QuizCode { get; set; }

        // Danh sách câu trả lời user đã chọn.
        public List<UserAnswerSubmissionDto> Answers { get; set; } = new();
    }
}
