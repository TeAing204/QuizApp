namespace QuizApp.WebAPI.Models.DTOs.Quiz
{
    public class QuizViewModel
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Duration { get; set; }
        public string? ThumbnailUrl { get; set; }
        public bool IsActive { get; set; }
        public int NumberOfQuestions { get; set; }
    }
}
