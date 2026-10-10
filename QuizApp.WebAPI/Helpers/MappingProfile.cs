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
    // AutoMapper profile: định nghĩa mapping giữa Entity và DTO.
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // ===== Role =====
            CreateMap<Role, RoleViewModel>();
            CreateMap<RoleCreateDto, Role>();
            CreateMap<RoleEditDto, Role>();

            // ===== User =====
            CreateMap<User, UserViewModel>()
                .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.Role.Name));

            CreateMap<UserCreateDto, User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())  // Hash riêng trong service
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"));

            CreateMap<UserEditDto, User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"));

            CreateMap<RegisterDto, User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"));

            // ===== Quiz =====
            CreateMap<Quiz, QuizViewModel>();
            CreateMap<QuizCreateDto, Quiz>();
            CreateMap<QuizEditDto, Quiz>();

            CreateMap<Quiz, QuizPrepareInfoDto>();
            CreateMap<Quiz, QuizForTestDto>();

            // ===== Question =====
            CreateMap<Question, QuestionViewModel>()
                .ForMember(dest => dest.QuestionType, opt => opt.MapFrom(src => src.QuestionType.ToString()));

            CreateMap<QuestionCreateDto, Question>()
                .ForMember(dest => dest.QuestionType, opt => opt.MapFrom(src => Enum.Parse<QuestionType>(src.QuestionType)));

            CreateMap<QuestionEditDto, Question>()
                .ForMember(dest => dest.QuestionType, opt => opt.MapFrom(src => Enum.Parse<QuestionType>(src.QuestionType)));

            CreateMap<Question, QuestionForTestDto>()
                .ForMember(dest => dest.QuestionType, opt => opt.MapFrom(src => src.QuestionType.ToString()));

            // ===== Answer =====
            CreateMap<Answer, AnswerViewModel>();
            CreateMap<AnswerCreateDto, Answer>();
            CreateMap<AnswerEditDto, Answer>();

            // Answer cho bài thi (giấu isCorrect)
            CreateMap<Answer, AnswerForTestDto>();
        }
    }
}
