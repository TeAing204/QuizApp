using AutoMapper;
using Microsoft.EntityFrameworkCore;
using QuizApp.WebAPI.Data;
using QuizApp.WebAPI.Models.DTOs.Role;
using QuizApp.WebAPI.Services.Interfaces;
using QuizApp.WebAPI.Exceptions;

namespace QuizApp.WebAPI.Services
{
    public class RoleService : IRoleService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public RoleService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<RoleViewModel>> GetAllAsync()
        {
            var roles = await _context.Roles.OrderBy(r => r.Name).ToListAsync();
            return _mapper.Map<List<RoleViewModel>>(roles);
        }

        public async Task<RoleViewModel?> GetByIdAsync(Guid id)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null) throw new NotFoundException("Role", id);
            return _mapper.Map<RoleViewModel>(role);
        }

        public async Task<bool> CreateAsync(RoleCreateDto dto)
        {
            if (await _context.Roles.AnyAsync(r => r.Name == dto.Name))
                throw new ConflictException($"Role name '{dto.Name}' already exists.");

            var role = _mapper.Map<Models.Entities.Role>(dto);
            _context.Roles.Add(role);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateAsync(RoleEditDto dto)
        {
            var role = await _context.Roles.FindAsync(dto.Id);
            if (role == null) throw new NotFoundException("Role", dto.Id);

            if (await _context.Roles.AnyAsync(r => r.Name == dto.Name && r.Id != dto.Id))
                throw new ConflictException($"Role name '{dto.Name}' already exists.");

            _mapper.Map(dto, role);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null) throw new NotFoundException("Role", id);

            // Không cho xóa role đang có user sử dụng
            if (await _context.Users.AnyAsync(u => u.RoleId == id))
                throw new BadRequestException("Cannot delete role that is assigned to users.");

            _context.Roles.Remove(role);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
