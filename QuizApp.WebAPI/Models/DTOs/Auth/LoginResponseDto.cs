using QuizApp.WebAPI.Models.DTOs.User;

namespace QuizApp.WebAPI.Models.DTOs.Auth
{
    // DTO cho response đăng nhập thành công.
    // Chứa thông tin user, JWT token và thời gian hết hạn.
    public class LoginResponseDto
    {
        // Thông tin user đã đăng nhập.
        public UserViewModel UserInformation { get; set; } = null!;

        // JWT token dùng cho các request tiếp theo.
        public string Token { get; set; } = string.Empty;

        // Thời gian token hết hạn (UTC).
        public DateTime Expires { get; set; }
    }
}
