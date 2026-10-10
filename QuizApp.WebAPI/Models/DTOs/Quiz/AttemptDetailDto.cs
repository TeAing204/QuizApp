namespace QuizApp.WebAPI.Models.DTOs.Quiz
{
    // DTO chi tiết một lần làm bài — trả về từng câu hỏi + đáp án đã chọn.
    public class AttemptDetailDto
    {
        public Guid QuizAttemptId { get; set; }
        public string QuizTitle { get; set; } = string.Empty;
        public decimal Score { get; set; }
        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public List<AttemptQuestionDetailDto> Questions { get; set; } = new();
    }

    // Chi tiết từng câu hỏi trong lần làm bài.
    public class AttemptQuestionDetailDto
    {
        public string QuestionContent { get; set; } = string.Empty;
        public string QuestionType { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
        public List<AttemptAnswerDetailDto> Answers { get; set; } = new();
    }

    // Chi tiết từng đáp án: nội dung, đúng/sai, user đã chọn hay chưa.
    public class AttemptAnswerDetailDto
    {
        public string Content { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
        public bool IsSelected { get; set; }
    }
}
