namespace QuizApp.WebAPI.Security
{
    /// <summary>
    /// Utility class cho hash và verify password sử dụng BCrypt.
    /// </summary>
    public static class PasswordHasher
    {
        /// <summary>
        /// Hash password bằng BCrypt với work factor mặc định (11).
        /// </summary>
        public static string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        /// <summary>
        /// Kiểm tra password có khớp với hash đã lưu không.
        /// </summary>
        public static bool VerifyPassword(string password, string passwordHash)
        {
            return BCrypt.Net.BCrypt.Verify(password, passwordHash);
        }
    }
}
