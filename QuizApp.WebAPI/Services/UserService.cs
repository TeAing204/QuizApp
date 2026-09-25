using AutoMapper;
using Microsoft.EntityFrameworkCore;
using QuizApp.WebAPI.Data;
using QuizApp.WebAPI.Models.DTOs.Common;
using QuizApp.WebAPI.Models.DTOs.User;
using QuizApp.WebAPI.Models.Entities;
using QuizApp.WebAPI.Security;
using QuizApp.WebAPI.Services.Interfaces;
using QuizApp.WebAPI.Data.Seeders;
using QuizApp.WebAPI.Exceptions;

namespace QuizApp.WebAPI.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public UserService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PaginatedResponse<UserViewModel>> GetAllAsync(PaginationParams p)
        {
            var query = _context.Users.Include(u => u.Role).AsQueryable();

            // Search
            if (!string.IsNullOrWhiteSpace(p.Search))
            {
                var search = p.Search.ToLower();
                query = query.Where(u =>
                    u.UserName.ToLower().Contains(search) ||
                    u.Email.ToLower().Contains(search) ||
                    u.FirstName.ToLower().Contains(search) ||
                    u.LastName.ToLower().Contains(search) ||
                    (u.DisplayName != null && u.DisplayName.ToLower().Contains(search)));
            }

            // Sort
            query = p.SortBy?.ToLower() switch
            {
                "username" => p.SortOrder == "asc" ? query.OrderBy(u => u.UserName) : query.OrderByDescending(u => u.UserName),
                "email" => p.SortOrder == "asc" ? query.OrderBy(u => u.Email) : query.OrderByDescending(u => u.Email),
                "displayname" => p.SortOrder == "asc" ? query.OrderBy(u => u.DisplayName) : query.OrderByDescending(u => u.DisplayName),
                _ => p.SortOrder == "asc" ? query.OrderBy(u => u.CreatedAt) : query.OrderByDescending(u => u.CreatedAt)
            };

            var totalElements = await query.CountAsync();

            var users = await query
                .Skip((p.PageNumber - 1) * p.PageSize)
                .Take(p.PageSize)
                .ToListAsync();

            var content = _mapper.Map<List<UserViewModel>>(users);
            return new PaginatedResponse<UserViewModel>(content, p.PageNumber, p.PageSize, totalElements);
        }

        public async Task<UserViewModel?> GetByIdAsync(Guid id)
        {
            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == id);
            if (user == null) throw new NotFoundException("User", id);
            return _mapper.Map<UserViewModel>(user);
        }

        public async Task<bool> CreateAsync(UserCreateDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.UserName == dto.UserName))
                throw new ConflictException($"Username '{dto.UserName}' already exists.");
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                throw new ConflictException($"Email '{dto.Email}' already exists.");

            var user = _mapper.Map<User>(dto);
            user.PasswordHash = PasswordHasher.HashPassword(dto.Password);
            user.DisplayName = $"{dto.FirstName} {dto.LastName}";
            user.RoleId = dto.RoleId ?? DataSeeder.UserRoleId; // Admin chọn role, hoặc mặc định User

            _context.Users.Add(user);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateAsync(UserEditDto dto)
        {
            var user = await _context.Users.FindAsync(dto.Id);
            if (user == null) throw new NotFoundException("User", dto.Id);

            // Kiểm tra trùng username/email với user khác
            if (await _context.Users.AnyAsync(u => u.UserName == dto.UserName && u.Id != dto.Id))
                throw new ConflictException($"Username '{dto.UserName}' already exists.");
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email && u.Id != dto.Id))
                throw new ConflictException($"Email '{dto.Email}' already exists.");

            _mapper.Map(dto, user);
            user.DisplayName = $"{dto.FirstName} {dto.LastName}";
            if (dto.RoleId.HasValue) user.RoleId = dto.RoleId.Value;
            user.UpdatedAt = DateTime.UtcNow;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) throw new NotFoundException("User", id);

            _context.Users.Remove(user);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordDto dto)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) throw new NotFoundException("User", userId);

            // Verify old password
            if (!PasswordHasher.VerifyPassword(dto.OldPassword, user.PasswordHash))
                throw new BadRequestException("Mật khẩu cũ không đúng.");

            // Hash & save new password
            user.PasswordHash = PasswordHasher.HashPassword(dto.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
