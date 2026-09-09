namespace QuizApp.WebAPI.Exceptions
{
    /// <summary>
    /// Ném khi dữ liệu đầu vào không hợp lệ hoặc vi phạm business rule.
    /// Maps to HTTP 400 Bad Request.
    /// </summary>
    public class BadRequestException : Exception
    {
        public BadRequestException(string message) : base(message) { }
    }
}
