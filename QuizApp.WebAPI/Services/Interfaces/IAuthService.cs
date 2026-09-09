using QuizApp.WebAPI.Models.DTOs.Auth;

namespace QuizApp.WebAPI.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto> LoginAsync(LoginDto dto);
        Task<LoginResponseDto> RegisterAsync(RegisterDto dto);
    }
}
