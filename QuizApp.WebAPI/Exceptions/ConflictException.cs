namespace QuizApp.WebAPI.Exceptions
{
    /// <summary>
    /// Ném khi dữ liệu xung đột (trùng username, email, entity đã tồn tại...).
    /// Maps to HTTP 409 Conflict.
    /// </summary>
    public class ConflictException : Exception
    {
        public ConflictException(string message) : base(message) { }
    }
}
