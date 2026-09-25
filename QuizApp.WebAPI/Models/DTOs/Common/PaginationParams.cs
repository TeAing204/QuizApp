using System.ComponentModel.DataAnnotations;

namespace QuizApp.WebAPI.Models.DTOs.Common
{
    /// <summary>
    /// Tham số phân trang, tìm kiếm, sắp xếp — bind từ query string.
    /// Tương đương @RequestParam trong Spring Boot.
    /// </summary>
    public class PaginationParams
    {
        public string? Search { get; set; }

        [Range(1, int.MaxValue)]
        public int PageNumber { get; set; } = 1;

        [Range(1, 100)]
        public int PageSize { get; set; } = 10;

        public string SortBy { get; set; } = "createdAt";

        public string SortOrder { get; set; } = "desc"; // "asc" or "desc"
    }
}
