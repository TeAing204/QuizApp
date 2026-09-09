using AutoMapper;
using Microsoft.EntityFrameworkCore;
using QuizApp.WebAPI.Data;
using QuizApp.WebAPI.Models.DTOs.Auth;
using QuizApp.WebAPI.Models.DTOs.User;
using QuizApp.WebAPI.Models.Entities;
using QuizApp.WebAPI.Security;
using QuizApp.WebAPI.Services.Interfaces;
using QuizApp.WebAPI.Data.Seeders;
using QuizApp.WebAPI.Exceptions;

namespace QuizApp.WebAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly JwtTokenProvider _jwtTokenProvider;

        public AuthService(AppDbContext context, IMapper mapper, JwtTokenProvider jwtTokenProvider)
        {
            _context = context;
            _mapper = mapper;
            _jwtTokenProvider = jwtTokenProvider;
        }

        public async Task<LoginResponseDto> LoginAsync(LoginDto dto)
        {
            // Tìm user theo username (include Role để lấy tên role)
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserName == dto.UserName);

            if (user == null)
                throw new UnauthorizedException("Invalid username or password.");

            // Kiểm tra account có active không
            if (!user.IsActive)
                throw new UnauthorizedException("Account is deactivated.");

            // Verify password
            if (!PasswordHasher.VerifyPassword(dto.Password, user.PasswordHash))
                throw new UnauthorizedException("Invalid username or password.");

            // Generate JWT token
            var (token, expires) = _jwtTokenProvider.GenerateToken(user);

            return new LoginResponseDto
            {
                UserInformation = _mapper.Map<UserViewModel>(user),
                Token = token,
                Expires = expires
            };
        }

        public async Task<LoginResponseDto> RegisterAsync(RegisterDto dto)
        {
            // Kiểm tra username đã tồn tại
            if (await _context.Users.AnyAsync(u => u.UserName == dto.UserName))
                throw new ConflictException($"Username '{dto.UserName}' already exists.");

            // Kiểm tra email đã tồn tại
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                throw new ConflictException($"Email '{dto.Email}' already exists.");

            // Tạo user mới với role User (mặc định)
            var user = _mapper.Map<User>(dto);
            user.PasswordHash = PasswordHasher.HashPassword(dto.Password);
            user.RoleId = DataSeeder.UserRoleId; // Gán role User mặc định (BR-03)

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Load role để map vào response
            await _context.Entry(user).Reference(u => u.Role).LoadAsync();

            // Tự động login sau khi register
            var (token, expires) = _jwtTokenProvider.GenerateToken(user);

            return new LoginResponseDto
            {
                UserInformation = _mapper.Map<UserViewModel>(user),
                Token = token,
                Expires = expires
            };
        }
    }
}
