namespace QuizApp.WebAPI.Security
{
    // Utility class cho hash và verify password sử dụng BCrypt.
    public static class PasswordHasher
    {
        // Hash password bằng BCrypt với work factor mặc định (11).
        public static string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        // Kiểm tra password có khớp với hash đã lưu không.
        public static bool VerifyPassword(string password, string passwordHash)
        {
            return BCrypt.Net.BCrypt.Verify(password, passwordHash);
        }
    }
}
