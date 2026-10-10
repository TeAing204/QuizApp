namespace QuizApp.WebAPI.Exceptions
{
    // Ném khi dữ liệu xung đột (trùng username, email, entity đã tồn tại...).
    // Maps to HTTP 409 Conflict.
    public class ConflictException : Exception
    {
        public ConflictException(string message) : base(message) { }
    }
}
