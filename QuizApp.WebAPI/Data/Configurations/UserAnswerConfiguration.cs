using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QuizApp.WebAPI.Models.Entities;

namespace QuizApp.WebAPI.Data.Configurations
{
    public class UserAnswerConfiguration : IEntityTypeConfiguration<UserAnswer>
    {
        public void Configure(EntityTypeBuilder<UserAnswer> builder)
        {
            builder.ToTable("UserAnswers");

            // Quan hệ: UserAnswer → QuizAttempt
            builder.HasOne(ua => ua.QuizAttempt)
                   .WithMany(qa => qa.UserAnswers)
                   .HasForeignKey(ua => ua.QuizAttemptId)
                   .OnDelete(DeleteBehavior.Cascade);

            // Quan hệ: UserAnswer → Question (không cascade - giữ data integrity)
            builder.HasOne(ua => ua.Question)
                   .WithMany()
                   .HasForeignKey(ua => ua.QuestionId)
                   .OnDelete(DeleteBehavior.Restrict);

            // Quan hệ: UserAnswer → Answer (không cascade - giữ data integrity)
            builder.HasOne(ua => ua.Answer)
                   .WithMany()
                   .HasForeignKey(ua => ua.AnswerId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
