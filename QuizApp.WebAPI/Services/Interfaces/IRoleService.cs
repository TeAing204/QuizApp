using QuizApp.WebAPI.Models.DTOs.Role;
using QuizApp.WebAPI.Models.DTOs.Common;

namespace QuizApp.WebAPI.Services.Interfaces
{
    public interface IRoleService
    {
        Task<PaginatedResponse<RoleViewModel>> GetAllAsync(PaginationParams p);
        Task<RoleViewModel?> GetByIdAsync(Guid id);
        Task<bool> CreateAsync(RoleCreateDto dto);
        Task<bool> UpdateAsync(RoleEditDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
