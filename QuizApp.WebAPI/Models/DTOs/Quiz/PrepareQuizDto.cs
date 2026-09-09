using QuizApp.WebAPI.Models.DTOs.User;

namespace QuizApp.WebAPI.Models.DTOs.Quiz
{
    /// <summary>
    /// DTO cho request chuẩn bị quiz (trước khi bắt đầu làm bài).
    /// </summary>
    public class PrepareQuizDto
    {
        public Guid UserId { get; set; }
        public Guid QuizId { get; set; }
        public string? QuizCode { get; set; }
    }

    /// <summary>
    /// DTO response chứa thông tin quiz đã chuẩn bị.
    /// </summary>
    public class QuizPrepareInfoDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Duration { get; set; }
        public string? ThumbnailUrl { get; set; }
        public string? QuizCode { get; set; }
        public UserViewModel User { get; set; } = null!;
    }
}
