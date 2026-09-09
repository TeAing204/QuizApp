using QuizApp.WebAPI.Models.Entities;

namespace QuizApp.WebAPI.Data.Seeders
{
    /// <summary>
    /// Seed dữ liệu ban đầu cho hệ thống:
    /// - 2 Roles: User, Administrator
    /// - 1 Admin account mặc định
    /// </summary>
    public static class DataSeeder
    {
        // Dùng Guid cố định để tránh tạo trùng khi seed lại
        public static readonly Guid UserRoleId = Guid.Parse("11111111-1111-1111-1111-111111111111");
        public static readonly Guid AdminRoleId = Guid.Parse("22222222-2222-2222-2222-222222222222");
        public static readonly Guid AdminUserId = Guid.Parse("33333333-3333-3333-3333-333333333333");

        /// <summary>
        /// Seed roles và admin account. Gọi trong Program.cs sau khi migrate.
        /// </summary>
        public static async Task SeedAsync(AppDbContext context)
        {
            // Seed Roles
            if (!context.Roles.Any())
            {
                context.Roles.AddRange(
                    new Role
                    {
                        Id = UserRoleId,
                        Name = "User",
                        Description = "Normal user - can take quizzes and view results",
                        IsActive = true
                    },
                    new Role
                    {
                        Id = AdminRoleId,
                        Name = "Administrator",
                        Description = "Admin user - can manage quizzes, questions, users and roles",
                        IsActive = true
                    }
                );
                await context.SaveChangesAsync();
            }

            // Seed Admin Account
            if (!context.Users.Any(u => u.UserName == "admin"))
            {
                context.Users.Add(new User
                {
                    Id = AdminUserId,
                    FirstName = "System",
                    LastName = "Admin",
                    DisplayName = "Administrator",
                    Email = "admin@quizapp.com",
                    UserName = "admin",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    IsActive = true,
                    RoleId = AdminRoleId
                });
                await context.SaveChangesAsync();
            }

            // Seed Sample Quizzes and Questions
            if (!context.Quizzes.Any())
            {
                var quiz1Id = Guid.Parse("44444444-4444-4444-4444-444444444444");
                var quiz2Id = Guid.Parse("55555555-5555-5555-5555-555555555555");

                var quiz1 = new Quiz
                {
                    Id = quiz1Id,
                    Title = "Kiến thức Angular & Web Development",
                    Description = "Kiểm tra kiến thức cơ bản và nâng cao về Angular Framework, TypeScript và Web Development.",
                    Duration = 15,
                    ThumbnailUrl = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                var quiz2 = new Quiz
                {
                    Id = quiz2Id,
                    Title = "Lập trình C# & ASP.NET Core Web API",
                    Description = "Bộ câu hỏi tổng hợp về ngôn ngữ C#, Entity Framework Core và kiến trúc ASP.NET Core.",
                    Duration = 20,
                    ThumbnailUrl = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                context.Quizzes.AddRange(quiz1, quiz2);

                // Questions for Quiz 1
                var q1Id = Guid.Parse("66666666-6666-6666-6666-666666666661");
                var q1 = new Question
                {
                    Id = q1Id,
                    Content = "Angular là gì?",
                    QuestionType = Models.Enums.QuestionType.SingleChoice,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    Answers = new List<Answer>
                    {
                        new Answer { Id = Guid.NewGuid(), Content = "Một framework JavaScript front-end do Google phát triển", IsCorrect = true, IsActive = true },
                        new Answer { Id = Guid.NewGuid(), Content = "Một hệ quản trị cơ sở dữ liệu quan hệ", IsCorrect = false, IsActive = true },
                        new Answer { Id = Guid.NewGuid(), Content = "Một ngôn ngữ lập trình back-end", IsCorrect = false, IsActive = true },
                        new Answer { Id = Guid.NewGuid(), Content = "Một công cụ thiết kế đồ họa", IsCorrect = false, IsActive = true }
                    }
                };

                var q2Id = Guid.Parse("66666666-6666-6666-6666-666666666662");
                var q2 = new Question
                {
                    Id = q2Id,
                    Content = "TypeScript là gì?",
                    QuestionType = Models.Enums.QuestionType.TrueFalse,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    Answers = new List<Answer>
                    {
                        new Answer { Id = Guid.NewGuid(), Content = "TypeScript là một siêu tập (superset) của JavaScript", IsCorrect = true, IsActive = true },
                        new Answer { Id = Guid.NewGuid(), Content = "TypeScript không thể biên dịch thành JavaScript", IsCorrect = false, IsActive = true }
                    }
                };

                var q3Id = Guid.Parse("66666666-6666-6666-6666-666666666663");
                var q3 = new Question
                {
                    Id = q3Id,
                    Content = "Những directive nào sau đây là Built-in Structural Directive trong Angular?",
                    QuestionType = Models.Enums.QuestionType.MultipleChoice,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    Answers = new List<Answer>
                    {
                        new Answer { Id = Guid.NewGuid(), Content = "*ngIf", IsCorrect = true, IsActive = true },
                        new Answer { Id = Guid.NewGuid(), Content = "*ngFor", IsCorrect = true, IsActive = true },
                        new Answer { Id = Guid.NewGuid(), Content = "*ngSwitch", IsCorrect = true, IsActive = true },
                        new Answer { Id = Guid.NewGuid(), Content = "*ngRoute", IsCorrect = false, IsActive = true }
                    }
                };

                // Questions for Quiz 2
                var q4Id = Guid.Parse("66666666-6666-6666-6666-666666666664");
                var q4 = new Question
                {
                    Id = q4Id,
                    Content = "ASP.NET Core hỗ trợ chạy trên những nền tảng OS nào?",
                    QuestionType = Models.Enums.QuestionType.MultipleChoice,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    Answers = new List<Answer>
                    {
                        new Answer { Id = Guid.NewGuid(), Content = "Windows", IsCorrect = true, IsActive = true },
                        new Answer { Id = Guid.NewGuid(), Content = "Linux", IsCorrect = true, IsActive = true },
                        new Answer { Id = Guid.NewGuid(), Content = "macOS", IsCorrect = true, IsActive = true },
                        new Answer { Id = Guid.NewGuid(), Content = "MS-DOS", IsCorrect = false, IsActive = true }
                    }
                };

                var q5Id = Guid.Parse("66666666-6666-6666-6666-666666666665");
                var q5 = new Question
                {
                    Id = q5Id,
                    Content = "Lớp DbContext trong EF Core đóng vai trò gì?",
                    QuestionType = Models.Enums.QuestionType.SingleChoice,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    Answers = new List<Answer>
                    {
                        new Answer { Id = Guid.NewGuid(), Content = "Là cầu nối chính để truy vấn và lưu trữ dữ liệu với Database", IsCorrect = true, IsActive = true },
                        new Answer { Id = Guid.NewGuid(), Content = "Dùng để tạo giao diện HTML", IsCorrect = false, IsActive = true },
                        new Answer { Id = Guid.NewGuid(), Content = "Dùng để mã hóa mật khẩu người dùng", IsCorrect = false, IsActive = true }
                    }
                };

                context.Questions.AddRange(q1, q2, q3, q4, q5);

                // Add QuizQuestions relationships
                context.QuizQuestions.AddRange(
                    new QuizQuestion { QuizId = quiz1Id, QuestionId = q1Id },
                    new QuizQuestion { QuizId = quiz1Id, QuestionId = q2Id },
                    new QuizQuestion { QuizId = quiz1Id, QuestionId = q3Id },
                    new QuizQuestion { QuizId = quiz2Id, QuestionId = q4Id },
                    new QuizQuestion { QuizId = quiz2Id, QuestionId = q5Id }
                );

                await context.SaveChangesAsync();
            }
        }
    }
}
