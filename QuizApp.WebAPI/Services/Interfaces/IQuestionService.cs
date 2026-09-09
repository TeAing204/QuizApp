using QuizApp.WebAPI.Models.DTOs.Question;

namespace QuizApp.WebAPI.Services.Interfaces
{
    public interface IQuestionService
    {
        Task<List<QuestionViewModel>> GetAllAsync();
        Task<QuestionViewModel?> GetByIdAsync(Guid id);
        Task<QuestionViewModel> CreateAsync(QuestionCreateDto dto);
        Task<bool> UpdateAsync(QuestionEditDto dto);
        Task<bool> DeleteAsync(Guid id);
        Task<List<AnswerViewModel>> GetAnswersByQuestionIdAsync(Guid questionId);
        Task<AnswerViewModel?> GetAnswerByIdAsync(Guid answerId);
        Task<bool> AddAnswerAsync(AnswerCreateDto dto);
        Task<bool> UpdateAnswerAsync(AnswerEditDto dto);
        Task<bool> DeleteAnswerAsync(Guid answerId, Guid questionId);
    }
}
