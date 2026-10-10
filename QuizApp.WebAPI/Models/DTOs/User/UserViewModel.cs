namespace QuizApp.WebAPI.Models.DTOs.User
{
    // DTO hiển thị thông tin user (dùng cho cả response API lẫn LoginResponse).
    public class UserViewModel
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? DisplayName { get; set; }
        public string Email { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Avatar { get; set; }
        public bool IsActive { get; set; }
        public string Roles { get; set; } = string.Empty;
    }
}
