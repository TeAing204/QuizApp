using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace QuizApp.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilesController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public FilesController(IWebHostEnvironment env)
        {
            _env = env;
        }

        // Upload ảnh (thumbnail quiz, avatar user, v.v.)
        [HttpPost("upload")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file uploaded." });

            // Chỉ cho phép ảnh
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(extension))
                return BadRequest(new { message = "Only image files (jpg, jpeg, png, gif, webp) are allowed." });

            // Giới hạn 5MB
            if (file.Length > 5 * 1024 * 1024)
                return BadRequest(new { message = "File size must not exceed 5MB." });

            // Tạo thư mục uploads nếu chưa có
            var uploadsFolder = Path.Combine(_env.ContentRootPath, "Uploads");
            Directory.CreateDirectory(uploadsFolder);

            // Tạo tên file unique
            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Trả về URL tương đối
            var fileUrl = $"/uploads/{fileName}";

            return Ok(new { url = fileUrl });
        }
    }
}
