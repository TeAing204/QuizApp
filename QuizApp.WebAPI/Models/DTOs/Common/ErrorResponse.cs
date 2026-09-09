namespace QuizApp.WebAPI.Models.DTOs.Common
{
    /// <summary>
    /// DTO chuẩn hóa response lỗi cho toàn bộ API.
    /// Mọi lỗi đều trả về format này để frontend dễ parse.
    /// </summary>
    public class ErrorResponse
    {
        public int StatusCode { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? Details { get; set; }

        public ErrorResponse(int statusCode, string message, string? details = null)
        {
            StatusCode = statusCode;
            Message = message;
            Details = details;
        }
    }
}
