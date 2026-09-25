using QuizApp.WebAPI.Models.DTOs.User;
using QuizApp.WebAPI.Models.DTOs.Common;

namespace QuizApp.WebAPI.Services.Interfaces
{
    public interface IUserService
    {
        Task<PaginatedResponse<UserViewModel>> GetAllAsync(PaginationParams p);
        Task<UserViewModel?> GetByIdAsync(Guid id);
        Task<bool> CreateAsync(UserCreateDto dto);
        Task<bool> UpdateAsync(UserEditDto dto);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordDto dto);
    }
}
