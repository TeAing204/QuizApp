using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QuizApp.WebAPI.Models.Entities;

namespace QuizApp.WebAPI.Data.Configurations
{
    public class QuizQuestionConfiguration : IEntityTypeConfiguration<QuizQuestion>
    {
        public void Configure(EntityTypeBuilder<QuizQuestion> builder)
        {
            builder.ToTable("QuizQuestions");

            // Unique constraint: Mỗi cặp (QuizId, QuestionId) chỉ xuất hiện một lần
            builder.HasIndex(qq => new { qq.QuizId, qq.QuestionId }).IsUnique();

            // Quan hệ: QuizQuestion → Quiz
            builder.HasOne(qq => qq.Quiz)
                   .WithMany(q => q.QuizQuestions)
                   .HasForeignKey(qq => qq.QuizId)
                   .OnDelete(DeleteBehavior.Cascade);

            // Quan hệ: QuizQuestion → Question
            builder.HasOne(qq => qq.Question)
                   .WithMany(q => q.QuizQuestions)
                   .HasForeignKey(qq => qq.QuestionId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
