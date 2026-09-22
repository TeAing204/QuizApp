using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuizApp.WebAPI.Models.DTOs.User;
using QuizApp.WebAPI.Services.Interfaces;

namespace QuizApp.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Administrator")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _userService.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var user = await _userService.GetByIdAsync(id);
            return Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UserCreateDto dto)
        {
            var result = await _userService.CreateAsync(dto);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UserEditDto dto)
        {
            dto.Id = id;
            var result = await _userService.UpdateAsync(dto);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _userService.DeleteAsync(id);
            return Ok(result);
        }

        [HttpPost("{id}/change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword(Guid id, [FromBody] ChangePasswordDto dto)
        {
            var result = await _userService.ChangePasswordAsync(id, dto);
            return Ok(result);
        }
    }
}
