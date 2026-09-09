using QuizApp.WebAPI.Models.DTOs.Role;

namespace QuizApp.WebAPI.Services.Interfaces
{
    public interface IRoleService
    {
        Task<List<RoleViewModel>> GetAllAsync();
        Task<RoleViewModel?> GetByIdAsync(Guid id);
        Task<bool> CreateAsync(RoleCreateDto dto);
        Task<bool> UpdateAsync(RoleEditDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
