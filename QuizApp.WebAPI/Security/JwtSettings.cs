namespace QuizApp.WebAPI.Security
{
    /// <summary>
    /// POCO class để bind cấu hình JWT từ appsettings.json.
    /// Sử dụng IOptions pattern trong DI.
    /// </summary>
    public class JwtSettings
    {
        /// <summary>
        /// Secret key dùng để ký và xác thực JWT token.
        /// Tối thiểu 32 ký tự để đảm bảo an toàn.
        /// </summary>
        public string SecretKey { get; set; } = string.Empty;

        /// <summary>
        /// Issuer - bên phát hành token (thường là tên API).
        /// </summary>
        public string Issuer { get; set; } = string.Empty;

        /// <summary>
        /// Audience - bên nhận token (thường là tên frontend app).
        /// </summary>
        public string Audience { get; set; } = string.Empty;

        /// <summary>
        /// Thời gian sống của token (đơn vị: phút).
        /// </summary>
        public int ExpiryInMinutes { get; set; } = 1440; // Mặc định 24 giờ
    }
}
