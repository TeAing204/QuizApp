using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using QuizApp.WebAPI.Models.Entities;

namespace QuizApp.WebAPI.Data.Configurations
{
    public class QuestionConfiguration : IEntityTypeConfiguration<Question>
    {
        public void Configure(EntityTypeBuilder<Question> builder)
        {
            builder.ToTable("Questions");

            // Lưu QuestionType dưới dạng string trong DB cho dễ đọc
            builder.Property(q => q.QuestionType)
                   .HasConversion<string>()
                   .HasMaxLength(30);
        }
    }
}
