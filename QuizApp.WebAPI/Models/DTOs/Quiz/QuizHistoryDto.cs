namespace QuizApp.WebAPI.Models.DTOs.Quiz
{
    // DTO trả về lịch sử làm bài của user.
    // Bao gồm thông tin quiz + kết quả từng lần thi.
    public class QuizHistoryDto
    {
        public Guid QuizAttemptId { get; set; }
        public Guid QuizId { get; set; }
        public string QuizTitle { get; set; } = string.Empty;
        public string? QuizDescription { get; set; }
        public int Duration { get; set; }
        public string? ThumbnailUrl { get; set; }
        public decimal? Score { get; set; }
        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public string? QuizCode { get; set; }

        // Trạng thái: "Completed" / "InProgress"
        public string Status => SubmittedAt.HasValue ? "Completed" : "InProgress";
    }
}
