using QuizApp.WebAPI.Models.DTOs.User;

namespace QuizApp.WebAPI.Models.DTOs.Auth
{
    /// <summary>
    /// DTO cho response đăng nhập thành công.
    /// Chứa thông tin user, JWT token và thời gian hết hạn.
    /// </summary>
    public class LoginResponseDto
    {
        /// <summary>
        /// Thông tin user đã đăng nhập.
        /// </summary>
        public UserViewModel UserInformation { get; set; } = null!;

        /// <summary>
        /// JWT token dùng cho các request tiếp theo.
        /// </summary>
        public string Token { get; set; } = string.Empty;

        /// <summary>
        /// Thời gian token hết hạn (UTC).
        /// </summary>
        public DateTime Expires { get; set; }
    }
}
