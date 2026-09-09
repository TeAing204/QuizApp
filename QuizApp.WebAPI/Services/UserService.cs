using AutoMapper;
using Microsoft.EntityFrameworkCore;
using QuizApp.WebAPI.Data;
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

        public async Task<List<UserViewModel>> GetAllAsync()
        {
            var users = await _context.Users.Include(u => u.Role).OrderBy(u => u.UserName).ToListAsync();
            return _mapper.Map<List<UserViewModel>>(users);
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
    }
}
