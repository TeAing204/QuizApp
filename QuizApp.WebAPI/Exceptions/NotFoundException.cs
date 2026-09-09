namespace QuizApp.WebAPI.Exceptions
{
    /// <summary>
    /// Ném khi không tìm thấy tài nguyên (Entity không tồn tại).
    /// Maps to HTTP 404 Not Found.
    /// </summary>
    public class NotFoundException : Exception
    {
        public NotFoundException(string message) : base(message) { }

        public NotFoundException(string entityName, object key)
            : base($"{entityName} with id '{key}' was not found.") { }
    }
}
