using AutoMapper;
using Microsoft.EntityFrameworkCore;
using QuizApp.WebAPI.Data;
using QuizApp.WebAPI.Models.DTOs.Common;
using QuizApp.WebAPI.Models.DTOs.Question;
using QuizApp.WebAPI.Models.Entities;
using QuizApp.WebAPI.Models.Enums;
using QuizApp.WebAPI.Services.Interfaces;
using QuizApp.WebAPI.Exceptions;

namespace QuizApp.WebAPI.Services
{
    public class QuestionService : IQuestionService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public QuestionService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PaginatedResponse<QuestionViewModel>> GetAllAsync(PaginationParams p)
        {
            var query = _context.Questions.AsQueryable();

            // Search
            if (!string.IsNullOrWhiteSpace(p.Search))
            {
                var search = p.Search.ToLower();
                query = query.Where(q => q.Content.ToLower().Contains(search));
            }

            // Sort
            query = p.SortBy?.ToLower() switch
            {
                "content" => p.SortOrder == "asc" ? query.OrderBy(q => q.Content) : query.OrderByDescending(q => q.Content),
                "questiontype" => p.SortOrder == "asc" ? query.OrderBy(q => q.QuestionType) : query.OrderByDescending(q => q.QuestionType),
                _ => p.SortOrder == "asc" ? query.OrderBy(q => q.CreatedAt) : query.OrderByDescending(q => q.CreatedAt)
            };

            var totalElements = await query.CountAsync();

            var questions = await query
                .Skip((p.PageNumber - 1) * p.PageSize)
                .Take(p.PageSize)
                .ToListAsync();

            var content = _mapper.Map<List<QuestionViewModel>>(questions);
            return new PaginatedResponse<QuestionViewModel>(content, p.PageNumber, p.PageSize, totalElements);
        }

        public async Task<QuestionViewModel?> GetByIdAsync(Guid id)
        {
            var question = await _context.Questions
                .Include(q => q.Answers)
                .FirstOrDefaultAsync(q => q.Id == id);
            if (question == null) throw new NotFoundException("Question", id);
            return _mapper.Map<QuestionViewModel>(question);
        }

        public async Task<QuestionViewModel> CreateAsync(QuestionCreateDto dto)
        {
            var question = _mapper.Map<Question>(dto);

            // Nếu có inline answers → tạo kèm
            if (dto.Answers != null && dto.Answers.Count > 0)
            {
                question.Answers = dto.Answers.Select(a => new Answer
                {
                    Content = a.Content,
                    IsCorrect = a.IsCorrect,
                    IsActive = a.IsActive
                }).ToList();
            }

            _context.Questions.Add(question);
            await _context.SaveChangesAsync();

            // Reload kèm answers để trả về ViewModel đầy đủ
            await _context.Entry(question).Collection(q => q.Answers).LoadAsync();
            return _mapper.Map<QuestionViewModel>(question);
        }

        public async Task<bool> UpdateAsync(QuestionEditDto dto)
        {
            var question = await _context.Questions.FindAsync(dto.Id);
            if (question == null) throw new NotFoundException("Question", dto.Id);

            _mapper.Map(dto, question);
            question.UpdatedAt = DateTime.UtcNow;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null) throw new NotFoundException("Question", id);

            _context.Questions.Remove(question);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<List<AnswerViewModel>> GetAnswersByQuestionIdAsync(Guid questionId)
        {
            var answers = await _context.Answers
                .Where(a => a.QuestionId == questionId)
                .ToListAsync();
            return _mapper.Map<List<AnswerViewModel>>(answers);
        }

        public async Task<AnswerViewModel?> GetAnswerByIdAsync(Guid answerId)
        {
            var answer = await _context.Answers.FindAsync(answerId);
            if (answer == null) throw new NotFoundException("Answer", answerId);
            return _mapper.Map<AnswerViewModel>(answer);
        }

        public async Task<bool> AddAnswerAsync(AnswerCreateDto dto)
        {
            var answer = _mapper.Map<Answer>(dto);
            _context.Answers.Add(answer);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateAnswerAsync(AnswerEditDto dto)
        {
            var answer = await _context.Answers.FindAsync(dto.Id);
            if (answer == null) throw new NotFoundException("Answer", dto.Id);

            _mapper.Map(dto, answer);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAnswerAsync(Guid answerId, Guid questionId)
        {
            var answer = await _context.Answers
                .FirstOrDefaultAsync(a => a.Id == answerId && a.QuestionId == questionId);
            if (answer == null) throw new NotFoundException("Answer", answerId);

            _context.Answers.Remove(answer);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
