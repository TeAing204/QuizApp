namespace QuizApp.WebAPI.Models.DTOs.Question
{
    /// <summary>
    /// DTO hiển thị thông tin câu hỏi (cho admin quản lý).
    /// </summary>
    public class QuestionViewModel
    {
        public Guid Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public string QuestionType { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    /// <summary>
    /// DTO câu hỏi trong bài thi (chứa đáp án nhưng KHÔNG có isCorrect).
    /// </summary>
    public class QuestionForTestDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public string QuestionType { get; set; } = string.Empty;
        public List<AnswerForTestDto> Answers { get; set; } = new();
    }

    /// <summary>
    /// DTO đáp án hiển thị trong bài thi (giấu isCorrect để bảo mật).
    /// </summary>
    public class AnswerForTestDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}
