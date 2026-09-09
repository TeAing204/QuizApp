using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using QuizApp.WebAPI.Models.Entities;

namespace QuizApp.WebAPI.Security
{
    /// <summary>
    /// Tạo JWT token từ thông tin user.
    /// Token chứa các claims: userId, userName, email, role.
    /// </summary>
    public class JwtTokenProvider
    {
        private readonly JwtSettings _jwtSettings;

        public JwtTokenProvider(IOptions<JwtSettings> jwtSettings)
        {
            _jwtSettings = jwtSettings.Value;
        }

        /// <summary>
        /// Tạo JWT token cho user đã xác thực.
        /// </summary>
        /// <param name="user">User entity (phải include Role).</param>
        /// <returns>JWT token string và thời gian hết hạn.</returns>
        public (string Token, DateTime Expires) GenerateToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.Name)
            };

            var expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryInMinutes);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: expires,
                signingCredentials: credentials
            );

            return (new JwtSecurityTokenHandler().WriteToken(token), expires);
        }
    }
}
