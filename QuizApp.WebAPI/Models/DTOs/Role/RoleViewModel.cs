namespace QuizApp.WebAPI.Models.DTOs.Role
{
    public class RoleViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }
}
