using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuizApp.WebAPI.Models.DTOs.Question;
using QuizApp.WebAPI.Services.Interfaces;

namespace QuizApp.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Administrator")]
    public class QuestionsController : ControllerBase
    {
        private readonly IQuestionService _questionService;

        public QuestionsController(IQuestionService questionService)
        {
            _questionService = questionService;
        }

        // ===== QUESTION CRUD =====

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _questionService.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var question = await _questionService.GetByIdAsync(id);
            return Ok(question);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] QuestionCreateDto dto)
        {
            var result = await _questionService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] QuestionEditDto dto)
        {
            dto.Id = id;
            var result = await _questionService.UpdateAsync(dto);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _questionService.DeleteAsync(id);
            return Ok(result);
        }

        // ===== ANSWER CRUD (nested) =====

        [HttpGet("{id}/answers")]
        public async Task<IActionResult> GetAnswers(Guid id)
        {
            return Ok(await _questionService.GetAnswersByQuestionIdAsync(id));
        }

        [HttpGet("answers/{answerId}")]
        public async Task<IActionResult> GetAnswerById(Guid answerId)
        {
            var answer = await _questionService.GetAnswerByIdAsync(answerId);
            return Ok(answer);
        }

        [HttpPost("{id}/answers")]
        public async Task<IActionResult> AddAnswer(Guid id, [FromBody] AnswerCreateDto dto)
        {
            dto.QuestionId = id;
            var result = await _questionService.AddAnswerAsync(dto);
            return Ok(result);
        }

        [HttpPut("answers/{answerId}")]
        public async Task<IActionResult> UpdateAnswer(Guid answerId, [FromBody] AnswerEditDto dto)
        {
            dto.Id = answerId;
            var result = await _questionService.UpdateAnswerAsync(dto);
            return Ok(result);
        }

        [HttpDelete("{questionId}/answers/{answerId}")]
        public async Task<IActionResult> DeleteAnswer(Guid questionId, Guid answerId)
        {
            var result = await _questionService.DeleteAnswerAsync(answerId, questionId);
            return Ok(result);
        }
    }
}
