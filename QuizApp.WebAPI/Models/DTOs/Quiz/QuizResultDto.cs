namespace QuizApp.WebAPI.Models.DTOs.Quiz
{
    /// <summary>
    /// DTO response sau khi nộp bài, trả về kết quả cho user.
    /// </summary>
    public class QuizResultDto
    {
        public Guid QuizAttemptId { get; set; }
        public Guid QuizId { get; set; }
        public string QuizTitle { get; set; } = string.Empty;
        public decimal Score { get; set; }
        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
        public DateTime SubmittedAt { get; set; }
    }
}
