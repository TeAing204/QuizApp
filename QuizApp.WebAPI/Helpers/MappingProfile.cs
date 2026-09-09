using AutoMapper;
using QuizApp.WebAPI.Models.Entities;
using QuizApp.WebAPI.Models.Enums;
using QuizApp.WebAPI.Models.DTOs.Auth;
using QuizApp.WebAPI.Models.DTOs.Quiz;
using QuizApp.WebAPI.Models.DTOs.Question;
using QuizApp.WebAPI.Models.DTOs.User;
using QuizApp.WebAPI.Models.DTOs.Role;

namespace QuizApp.WebAPI.Helpers
{
    /// <summary>
    /// AutoMapper profile: định nghĩa mapping giữa Entity và DTO.
    /// </summary>
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // ===== Role =====
            CreateMap<Models.Entities.Role, RoleViewModel>();
            CreateMap<RoleCreateDto, Models.Entities.Role>();
            CreateMap<RoleEditDto, Models.Entities.Role>();

            // ===== User =====
            CreateMap<Models.Entities.User, UserViewModel>()
                .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.Role.Name));

            CreateMap<UserCreateDto, Models.Entities.User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())  // Hash riêng trong service
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"));

            CreateMap<UserEditDto, Models.Entities.User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore());

            CreateMap<RegisterDto, Models.Entities.User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"));

            // ===== Quiz =====
            CreateMap<Models.Entities.Quiz, QuizViewModel>();
            CreateMap<QuizCreateDto, Models.Entities.Quiz>();
            CreateMap<QuizEditDto, Models.Entities.Quiz>();

            CreateMap<Models.Entities.Quiz, QuizPrepareInfoDto>();
            CreateMap<Models.Entities.Quiz, QuizForTestDto>();

            // ===== Question =====
            CreateMap<Models.Entities.Question, QuestionViewModel>()
                .ForMember(dest => dest.QuestionType, opt => opt.MapFrom(src => src.QuestionType.ToString()));

            CreateMap<QuestionCreateDto, Models.Entities.Question>()
                .ForMember(dest => dest.QuestionType, opt => opt.MapFrom(src => Enum.Parse<QuestionType>(src.QuestionType)));

            CreateMap<QuestionEditDto, Models.Entities.Question>()
                .ForMember(dest => dest.QuestionType, opt => opt.MapFrom(src => Enum.Parse<QuestionType>(src.QuestionType)));

            CreateMap<Models.Entities.Question, QuestionForTestDto>()
                .ForMember(dest => dest.QuestionType, opt => opt.MapFrom(src => src.QuestionType.ToString()));

            // ===== Answer =====
            CreateMap<Models.Entities.Answer, AnswerViewModel>();
            CreateMap<AnswerCreateDto, Models.Entities.Answer>();
            CreateMap<AnswerEditDto, Models.Entities.Answer>();

            // Answer cho bài thi (giấu isCorrect)
            CreateMap<Models.Entities.Answer, AnswerForTestDto>();
        }
    }
}
