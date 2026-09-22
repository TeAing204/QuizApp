using System.Net;
using System.Text.Json;
using QuizApp.WebAPI.Exceptions;
using QuizApp.WebAPI.Models.DTOs.Common;

namespace QuizApp.WebAPI.Middlewares
{
    // Middleware xử lý exception toàn cục.
    // Bắt tất cả exception từ service layer, tự động map sang HTTP status code
    // và trả về ErrorResponse chuẩn hóa.
    public class GlobalExceptionHandler
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionHandler> _logger;

        public GlobalExceptionHandler(RequestDelegate next, ILogger<GlobalExceptionHandler> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            HttpStatusCode statusCode;
            string message;
            string? details = null;

            switch (exception)
            {
                case NotFoundException notFoundEx:
                    statusCode = HttpStatusCode.NotFound;
                    message = notFoundEx.Message;
                    _logger.LogWarning("Not Found: {Message}", message);
                    break;

                case BadRequestException badRequestEx:
                    statusCode = HttpStatusCode.BadRequest;
                    message = badRequestEx.Message;
                    _logger.LogWarning("Bad Request: {Message}", message);
                    break;

                case UnauthorizedException unauthorizedEx:
                    statusCode = HttpStatusCode.Unauthorized;
                    message = unauthorizedEx.Message;
                    _logger.LogWarning("Unauthorized: {Message}", message);
                    break;

                case ConflictException conflictEx:
                    statusCode = HttpStatusCode.Conflict;
                    message = conflictEx.Message;
                    _logger.LogWarning("Conflict: {Message}", message);
                    break;

                default:
                    // Lỗi không mong đợi — log đầy đủ, ẩn chi tiết khỏi client
                    statusCode = HttpStatusCode.InternalServerError;
                    message = "An unexpected error occurred. Please try again later.";
                    _logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);

                    // Chỉ hiển thị details ở môi trường Development
                    if (context.RequestServices.GetRequiredService<IWebHostEnvironment>().IsDevelopment())
                    {
                        details = exception.ToString();
                    }
                    break;
            }

            var errorResponse = new ErrorResponse((int)statusCode, message, details);

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            var json = JsonSerializer.Serialize(errorResponse, jsonOptions);

            await context.Response.WriteAsync(json);
        }
    }
}
