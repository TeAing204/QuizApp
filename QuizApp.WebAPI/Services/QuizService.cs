using AutoMapper;
using Microsoft.EntityFrameworkCore;
using QuizApp.WebAPI.Data;
using QuizApp.WebAPI.Models.DTOs.Common;
using QuizApp.WebAPI.Models.DTOs.Question;
using QuizApp.WebAPI.Models.DTOs.Quiz;
using QuizApp.WebAPI.Models.DTOs.User;
using QuizApp.WebAPI.Models.Entities;
using QuizApp.WebAPI.Services.Interfaces;
using QuizApp.WebAPI.Exceptions;

namespace QuizApp.WebAPI.Services
{
    public class QuizService : IQuizService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public QuizService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PaginatedResponse<QuizViewModel>> GetAllAsync(PaginationParams p)
        {
            var query = _context.Quizzes
                .Include(q => q.QuizQuestions)
                .AsQueryable();

            // Search
            if (!string.IsNullOrWhiteSpace(p.Search))
            {
                var search = p.Search.ToLower();
                query = query.Where(q =>
                    q.Title.ToLower().Contains(search) ||
                    (q.Description != null && q.Description.ToLower().Contains(search)));
            }

            // Sort
            query = p.SortBy?.ToLower() switch
            {
                "title" => p.SortOrder == "asc" ? query.OrderBy(q => q.Title) : query.OrderByDescending(q => q.Title),
                "duration" => p.SortOrder == "asc" ? query.OrderBy(q => q.Duration) : query.OrderByDescending(q => q.Duration),
                "isactive" => p.SortOrder == "asc" ? query.OrderBy(q => q.IsActive) : query.OrderByDescending(q => q.IsActive),
                _ => p.SortOrder == "asc" ? query.OrderBy(q => q.CreatedAt) : query.OrderByDescending(q => q.CreatedAt)
            };

            // Count
            var totalElements = await query.CountAsync();

            // Pagination
            var quizzes = await query
                .Skip((p.PageNumber - 1) * p.PageSize)
                .Take(p.PageSize)
                .ToListAsync();

            var content = quizzes.Select(q =>
            {
                var vm = _mapper.Map<QuizViewModel>(q);
                vm.NumberOfQuestions = q.QuizQuestions.Count;
                return vm;
            }).ToList();

            return new PaginatedResponse<QuizViewModel>(content, p.PageNumber, p.PageSize, totalElements);
        }

        public async Task<QuizViewModel?> GetByIdAsync(Guid id)
        {
            var quiz = await _context.Quizzes
                .Include(q => q.QuizQuestions)
                .FirstOrDefaultAsync(q => q.Id == id);
            if (quiz == null) throw new NotFoundException("Quiz", id);

            var vm = _mapper.Map<QuizViewModel>(quiz);
            vm.NumberOfQuestions = quiz.QuizQuestions.Count;
            return vm;
        }

        public async Task<Guid> CreateAsync(QuizCreateDto dto)
        {
            var quiz = _mapper.Map<Quiz>(dto);
            _context.Quizzes.Add(quiz);
            await _context.SaveChangesAsync();
            return quiz.Id;
        }

        public async Task<bool> UpdateAsync(QuizEditDto dto)
        {
            var quiz = await _context.Quizzes.FindAsync(dto.Id);
            if (quiz == null) throw new NotFoundException("Quiz", dto.Id);

            _mapper.Map(dto, quiz);
            quiz.UpdatedAt = DateTime.UtcNow;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var quiz = await _context.Quizzes.FindAsync(id);
            if (quiz == null) throw new NotFoundException("Quiz", id);

            _context.Quizzes.Remove(quiz);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> AddQuestionToQuizAsync(QuizQuestionCreateDto dto)
        {
            // Kiểm tra trùng lặp
            var exists = await _context.QuizQuestions
                .AnyAsync(qq => qq.QuizId == dto.QuizId && qq.QuestionId == dto.QuestionId);
            if (exists) throw new ConflictException("Question already exists in this quiz.");

            _context.QuizQuestions.Add(new QuizQuestion
            {
                QuizId = dto.QuizId,
                QuestionId = dto.QuestionId
            });
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteQuestionFromQuizAsync(Guid quizId, Guid quizQuestionId)
        {
            var qq = await _context.QuizQuestions
                .FirstOrDefaultAsync(x => x.Id == quizQuestionId && x.QuizId == quizId);
            if (qq == null) throw new NotFoundException("QuizQuestion", quizQuestionId);

            _context.QuizQuestions.Remove(qq);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<List<QuestionViewModel>> GetQuestionsByQuizIdAsync(Guid quizId)
        {
            var questions = await _context.QuizQuestions
                .Where(qq => qq.QuizId == quizId)
                .Include(qq => qq.Question)
                .Select(qq => qq.Question)
                .ToListAsync();
            return _mapper.Map<List<QuestionViewModel>>(questions);
        }

        public async Task<QuizPrepareInfoDto?> PrepareQuizAsync(PrepareQuizDto dto)
        {
            var quiz = await _context.Quizzes.FindAsync(dto.QuizId);
            if (quiz == null) throw new NotFoundException("Quiz", dto.QuizId);
            if (!quiz.IsActive) throw new BadRequestException("Quiz is not active.");

            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == dto.UserId);
            if (user == null) throw new NotFoundException("User", dto.UserId);

            var result = _mapper.Map<QuizPrepareInfoDto>(quiz);
            result.QuizCode = dto.QuizCode;
            result.User = _mapper.Map<UserViewModel>(user);
            return result;
        }

        public async Task<QuizForTestDto?> TakeQuizAsync(TakeQuizDto dto)
        {
            var quiz = await _context.Quizzes
                .Include(q => q.QuizQuestions)
                    .ThenInclude(qq => qq.Question)
                        .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(q => q.Id == dto.QuizId);

            if (quiz == null) throw new NotFoundException("Quiz", dto.QuizId);
            if (!quiz.IsActive) throw new BadRequestException("Quiz is not active.");

            // Tạo QuizAttempt
            var attempt = new QuizAttempt
            {
                UserId = dto.UserId,
                QuizId = dto.QuizId,
                QuizCode = dto.QuizCode,
                StartTime = DateTime.UtcNow
            };
            _context.QuizAttempts.Add(attempt);
            await _context.SaveChangesAsync();

            // Map quiz + questions (ẩn đáp án đúng)
            var result = new QuizForTestDto
            {
                Id = quiz.Id,
                Title = quiz.Title,
                Description = quiz.Description,
                Duration = quiz.Duration,
                QuizCode = dto.QuizCode,
                StartTime = attempt.StartTime,
                Questions = quiz.QuizQuestions
                    .Where(qq => qq.Question.IsActive)
                    .Select(qq => new QuestionForTestDto
                    {
                        Id = qq.Question.Id,
                        Content = qq.Question.Content,
                        QuestionType = qq.Question.QuestionType.ToString(),
                        Answers = qq.Question.Answers
                            .Where(a => a.IsActive)
                            .Select(a => new AnswerForTestDto { Id = a.Id, Content = a.Content })
                            .ToList()
                    }).ToList()
            };

            return result;
        }

        public async Task<QuizResultDto?> SubmitQuizAsync(QuizSubmissionDto dto)
        {
            // Tìm attempt chưa submit gần nhất
            var attempt = await _context.QuizAttempts
                .Include(a => a.Quiz)
                    .ThenInclude(q => q.QuizQuestions)
                        .ThenInclude(qq => qq.Question)
                            .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(a =>
                    a.UserId == dto.UserId &&
                    a.QuizId == dto.QuizId &&
                    a.SubmittedAt == null);

            if (attempt == null) throw new BadRequestException("No active quiz attempt found. Please start the quiz first.");

            // Lưu các câu trả lời
            foreach (var answer in dto.Answers)
            {
                _context.UserAnswers.Add(new UserAnswer
                {
                    QuizAttemptId = attempt.Id,
                    QuestionId = answer.QuestionId,
                    AnswerId = answer.AnswerId
                });
            }

            // Tính điểm theo TỪNG CÂU HỎI (không phải từng đáp án)
            // Câu đúng = user chọn đúng TẤT CẢ đáp án đúng VÀ KHÔNG chọn đáp án sai
            int totalQuestions = attempt.Quiz.QuizQuestions.Count;
            int correctCount = 0;

            // Group các đáp án user chọn theo QuestionId
            var userAnswersByQuestion = dto.Answers
                .GroupBy(a => a.QuestionId)
                .ToDictionary(g => g.Key, g => g.Select(a => a.AnswerId).ToHashSet());

            foreach (var qq in attempt.Quiz.QuizQuestions)
            {
                var question = qq.Question;
                // Tập đáp án đúng của câu hỏi
                var correctAnswerIds = question.Answers
                    .Where(a => a.IsCorrect && a.IsActive)
                    .Select(a => a.Id)
                    .ToHashSet();

                // Tập đáp án user đã chọn cho câu này
                userAnswersByQuestion.TryGetValue(question.Id, out var selectedIds);
                selectedIds ??= new HashSet<Guid>();

                // Câu đúng khi: user chọn đúng tất cả đáp án đúng VÀ không chọn đáp án sai
                if (correctAnswerIds.SetEquals(selectedIds))
                    correctCount++;
            }

            // Score = (đúng / tổng) * 100
            decimal score = totalQuestions > 0
                ? Math.Round((decimal)correctCount / totalQuestions * 100, 2)
                : 0;

            attempt.Score = score;
            attempt.SubmittedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new QuizResultDto
            {
                QuizAttemptId = attempt.Id,
                QuizId = attempt.QuizId,
                QuizTitle = attempt.Quiz.Title,
                Score = score,
                TotalQuestions = totalQuestions,
                CorrectAnswers = correctCount,
                SubmittedAt = attempt.SubmittedAt.Value
            };
        }

        public async Task<List<QuizHistoryDto>> GetHistoryByUserIdAsync(Guid userId)
        {
            var attempts = await _context.QuizAttempts
                .Where(a => a.UserId == userId)
                .Include(a => a.Quiz)
                    .ThenInclude(q => q.QuizQuestions)
                        .ThenInclude(qq => qq.Question)
                            .ThenInclude(q => q.Answers)
                .Include(a => a.UserAnswers)
                .OrderByDescending(a => a.StartTime)
                .ToListAsync();

            return attempts.Select(a =>
            {
                // Tính đúng theo từng câu hỏi
                var userAnswersByQuestion = a.UserAnswers
                    .GroupBy(ua => ua.QuestionId)
                    .ToDictionary(g => g.Key, g => g.Select(ua => ua.AnswerId).ToHashSet());

                int totalQuestions = a.Quiz.QuizQuestions.Count;
                int correctCount = 0;

                foreach (var qq in a.Quiz.QuizQuestions)
                {
                    var correctAnswerIds = qq.Question.Answers
                        .Where(ans => ans.IsCorrect && ans.IsActive)
                        .Select(ans => ans.Id)
                        .ToHashSet();

                    userAnswersByQuestion.TryGetValue(qq.Question.Id, out var selectedIds);
                    selectedIds ??= new HashSet<Guid>();

                    if (correctAnswerIds.SetEquals(selectedIds))
                        correctCount++;
                }

                return new QuizHistoryDto
                {
                    QuizAttemptId = a.Id,
                    QuizId = a.QuizId,
                    QuizTitle = a.Quiz.Title,
                    QuizDescription = a.Quiz.Description,
                    Duration = a.Quiz.Duration,
                    ThumbnailUrl = a.Quiz.ThumbnailUrl,
                    Score = a.Score,
                    TotalQuestions = totalQuestions,
                    CorrectAnswers = correctCount,
                    StartTime = a.StartTime,
                    SubmittedAt = a.SubmittedAt,
                    QuizCode = a.QuizCode
                };
            }).ToList();
        }

        public async Task<AttemptDetailDto?> GetAttemptDetailAsync(Guid attemptId)
        {
            var attempt = await _context.QuizAttempts
                .Include(a => a.Quiz)
                    .ThenInclude(q => q.QuizQuestions)
                        .ThenInclude(qq => qq.Question)
                            .ThenInclude(q => q.Answers)
                .Include(a => a.UserAnswers)
                .FirstOrDefaultAsync(a => a.Id == attemptId);

            if (attempt == null) throw new NotFoundException("QuizAttempt", attemptId);

            var userAnswersByQuestion = attempt.UserAnswers
                .GroupBy(ua => ua.QuestionId)
                .ToDictionary(g => g.Key, g => g.Select(ua => ua.AnswerId).ToHashSet());

            var questions = new List<AttemptQuestionDetailDto>();
            int correctCount = 0;

            foreach (var qq in attempt.Quiz.QuizQuestions)
            {
                var question = qq.Question;
                userAnswersByQuestion.TryGetValue(question.Id, out var selectedIds);
                selectedIds ??= new HashSet<Guid>();

                var correctAnswerIds = question.Answers
                    .Where(a => a.IsCorrect && a.IsActive)
                    .Select(a => a.Id)
                    .ToHashSet();

                bool isCorrect = correctAnswerIds.SetEquals(selectedIds);
                if (isCorrect) correctCount++;

                questions.Add(new AttemptQuestionDetailDto
                {
                    QuestionContent = question.Content,
                    QuestionType = question.QuestionType.ToString(),
                    IsCorrect = isCorrect,
                    Answers = question.Answers
                        .Where(a => a.IsActive)
                        .Select(a => new AttemptAnswerDetailDto
                        {
                            Content = a.Content,
                            IsCorrect = a.IsCorrect,
                            IsSelected = selectedIds.Contains(a.Id)
                        }).ToList()
                });
            }

            return new AttemptDetailDto
            {
                QuizAttemptId = attempt.Id,
                QuizTitle = attempt.Quiz.Title,
                Score = attempt.Score ?? 0,
                TotalQuestions = attempt.Quiz.QuizQuestions.Count,
                CorrectAnswers = correctCount,
                StartTime = attempt.StartTime,
                SubmittedAt = attempt.SubmittedAt,
                Questions = questions
            };
        }
    }
}

