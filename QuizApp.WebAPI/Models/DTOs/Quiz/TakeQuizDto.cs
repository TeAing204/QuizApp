using QuizApp.WebAPI.Models.DTOs.Question;

namespace QuizApp.WebAPI.Models.DTOs.Quiz
{
    /// <summary>
    /// DTO cho request bắt đầu làm quiz.
    /// </summary>
    public class TakeQuizDto
    {
        public Guid UserId { get; set; }
        public Guid QuizId { get; set; }
        public string? QuizCode { get; set; }
    }

    /// <summary>
    /// DTO response chứa quiz + câu hỏi + đáp án (không có isCorrect) để user làm bài.
    /// </summary>
    public class QuizForTestDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Duration { get; set; }
        public string? QuizCode { get; set; }
        public DateTime StartTime { get; set; }
        public List<QuestionForTestDto> Questions { get; set; } = new();
    }
}
