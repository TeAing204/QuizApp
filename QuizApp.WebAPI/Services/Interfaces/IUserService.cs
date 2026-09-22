using QuizApp.WebAPI.Models.DTOs.User;

namespace QuizApp.WebAPI.Services.Interfaces
{
    public interface IUserService
    {
        Task<List<UserViewModel>> GetAllAsync();
        Task<UserViewModel?> GetByIdAsync(Guid id);
        Task<bool> CreateAsync(UserCreateDto dto);
        Task<bool> UpdateAsync(UserEditDto dto);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordDto dto);
    }
}
