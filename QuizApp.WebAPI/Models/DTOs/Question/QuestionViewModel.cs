namespace QuizApp.WebAPI.Models.DTOs.Question
{
    // DTO hiển thị thông tin câu hỏi (cho admin quản lý).
    public class QuestionViewModel
    {
        public Guid Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public string QuestionType { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    // DTO câu hỏi trong bài thi (chứa đáp án nhưng KHÔNG có isCorrect).
    public class QuestionForTestDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public string QuestionType { get; set; } = string.Empty;
        public List<AnswerForTestDto> Answers { get; set; } = new();
    }
    
    // DTO đáp án hiển thị trong bài thi (giấu isCorrect để bảo mật).
    public class AnswerForTestDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}
