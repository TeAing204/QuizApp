namespace QuizApp.WebAPI.Exceptions
{
    // Maps to HTTP 400 Bad Request.
    // Quiz bị tắt hoặc mk cũ bị sai
    public class BadRequestException : Exception
    {
        public BadRequestException(string message) : base(message) { }
    }
}
