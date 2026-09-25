using QuizApp.WebAPI.Models.DTOs.Quiz;
using QuizApp.WebAPI.Models.DTOs.Common;
using QuizApp.WebAPI.Models.DTOs.Question;

namespace QuizApp.WebAPI.Services.Interfaces
{
    public interface IQuizService
    {
        Task<PaginatedResponse<QuizViewModel>> GetAllAsync(PaginationParams p);
        Task<QuizViewModel?> GetByIdAsync(Guid id);
        Task<Guid> CreateAsync(QuizCreateDto dto);
        Task<bool> UpdateAsync(QuizEditDto dto);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> AddQuestionToQuizAsync(QuizQuestionCreateDto dto);
        Task<bool> DeleteQuestionFromQuizAsync(Guid quizId, Guid quizQuestionId);
        Task<List<QuestionViewModel>> GetQuestionsByQuizIdAsync(Guid quizId);
        Task<QuizPrepareInfoDto?> PrepareQuizAsync(PrepareQuizDto dto);
        Task<QuizForTestDto?> TakeQuizAsync(TakeQuizDto dto);
        Task<QuizResultDto?> SubmitQuizAsync(QuizSubmissionDto dto);
        Task<List<QuizHistoryDto>> GetHistoryByUserIdAsync(Guid userId);
        Task<AttemptDetailDto?> GetAttemptDetailAsync(Guid attemptId);
    }
}
