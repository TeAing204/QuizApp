using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QuizApp.WebAPI.Models.Entities;

namespace QuizApp.WebAPI.Data.Configurations
{
    public class QuizAttemptConfiguration : IEntityTypeConfiguration<QuizAttempt>
    {
        public void Configure(EntityTypeBuilder<QuizAttempt> builder)
        {
            builder.ToTable("QuizAttempts");

            // Score precision: 5 chữ số, 2 sau dấu phẩy (VD: 100.00)
            builder.Property(qa => qa.Score).HasPrecision(5, 2);

            // Quan hệ: QuizAttempt → User
            builder.HasOne(qa => qa.User)
                   .WithMany(u => u.QuizAttempts)
                   .HasForeignKey(qa => qa.UserId)
                   .OnDelete(DeleteBehavior.Restrict);

            // Quan hệ: QuizAttempt → Quiz
            builder.HasOne(qa => qa.Quiz)
                   .WithMany(q => q.QuizAttempts)
                   .HasForeignKey(qa => qa.QuizId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
