namespace QuizApp.WebAPI.Exceptions
{
    /// <summary>
    /// Ném khi xác thực thất bại (sai mật khẩu, tài khoản bị khóa...).
    /// Maps to HTTP 401 Unauthorized.
    /// </summary>
    public class UnauthorizedException : Exception
    {
        public UnauthorizedException(string message) : base(message) { }
    }
}
