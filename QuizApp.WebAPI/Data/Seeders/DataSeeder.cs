using QuizApp.WebAPI.Models.Entities;

namespace QuizApp.WebAPI.Data.Seeders
{
    // Seed dữ liệu thiết yếu cho hệ thống:
    // - 2 Roles: User, Administrator
    // - 1 Admin account mặc định
    public static class DataSeeder
    {
        // Dùng Guid cố định để tránh tạo trùng khi seed lại
        public static readonly Guid UserRoleId = Guid.Parse("11111111-1111-1111-1111-111111111111");
        public static readonly Guid AdminRoleId = Guid.Parse("22222222-2222-2222-2222-222222222222");
        public static readonly Guid AdminUserId = Guid.Parse("33333333-3333-3333-3333-333333333333");

        // Seed roles và admin account. Gọi trong Program.cs sau khi migrate.
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
        }
    }
}

