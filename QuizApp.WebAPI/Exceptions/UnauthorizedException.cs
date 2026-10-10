namespace QuizApp.WebAPI.Exceptions
{
    // Maps to HTTP 401 Unauthorized.
    // Đăng nhập sai hoặc tk bị khóa
    public class UnauthorizedException : Exception
    {
        public UnauthorizedException(string message) : base(message) { }
    }
}
