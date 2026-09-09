using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuizApp.WebAPI.Models.DTOs.Common;
using QuizApp.WebAPI.Models.DTOs.Quiz;
using QuizApp.WebAPI.Services.Interfaces;

namespace QuizApp.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizzesController : ControllerBase
    {
        private readonly IQuizService _quizService;

        public QuizzesController(IQuizService quizService)
        {
            _quizService = quizService;
        }

        // ===== PUBLIC ENDPOINTS =====

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var quizzes = await _quizService.GetAllAsync();
            return Ok(quizzes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var quiz = await _quizService.GetByIdAsync(id);
            return Ok(quiz);
        }

        // ===== ADMIN ENDPOINTS =====

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Create([FromBody] QuizCreateDto dto)
        {
            var result = await _quizService.CreateAsync(dto);
            return Ok(result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Update(Guid id, [FromBody] QuizEditDto dto)
        {
            dto.Id = id;
            var result = await _quizService.UpdateAsync(dto);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _quizService.DeleteAsync(id);
            return Ok(result);
        }

        [HttpGet("{id}/questions")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> GetQuestions(Guid id)
        {
            var questions = await _quizService.GetQuestionsByQuizIdAsync(id);
            return Ok(questions);
        }

        [HttpPost("{id}/questions")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> AddQuestion(Guid id, [FromBody] QuizQuestionCreateDto dto)
        {
            dto.QuizId = id;
            var result = await _quizService.AddQuestionToQuizAsync(dto);
            return Ok(result);
        }

        [HttpDelete("{id}/questions/{quizQuestionId}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> RemoveQuestion(Guid id, Guid quizQuestionId)
        {
            var result = await _quizService.DeleteQuestionFromQuizAsync(id, quizQuestionId);
            return Ok(result);
        }

        // ===== AUTHENTICATED USER ENDPOINTS =====

        [HttpPost("prepare")]
        [Authorize]
        public async Task<IActionResult> PrepareQuiz([FromBody] PrepareQuizDto dto)
        {
            var result = await _quizService.PrepareQuizAsync(dto);
            return Ok(result);
        }

        [HttpPost("take")]
        [Authorize]
        public async Task<IActionResult> TakeQuiz([FromBody] TakeQuizDto dto)
        {
            var result = await _quizService.TakeQuizAsync(dto);
            return Ok(result);
        }

        [HttpPost("submit")]
        [Authorize]
        public async Task<IActionResult> SubmitQuiz([FromBody] QuizSubmissionDto dto)
        {
            var result = await _quizService.SubmitQuizAsync(dto);
            return Ok(result);
        }
    }
}
