namespace QuizApp.WebAPI.Security
{
    // POCO class để bind cấu hình JWT từ appsettings.json.
    // Sử dụng IOptions pattern trong DI.
    public class JwtSettings
    {
        // Secret key dùng để ký và xác thực JWT token.
        // Tối thiểu 32 ký tự để đảm bảo an toàn.
        public string SecretKey { get; set; } = string.Empty;

        // Issuer - bên phát hành token (thường là tên API).
        public string Issuer { get; set; } = string.Empty;

        // Audience - bên nhận token (thường là tên frontend app).
        public string Audience { get; set; } = string.Empty;

        // Thời gian sống của token (đơn vị: phút).
        public int ExpiryInMinutes { get; set; } = 1440; // Mặc định 24 giờ
    }
}
