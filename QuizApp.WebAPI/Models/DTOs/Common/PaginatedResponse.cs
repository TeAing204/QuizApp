namespace QuizApp.WebAPI.Models.DTOs.Common
{
    /// <summary>
    /// Generic paginated response — tương đương Page&lt;T&gt; trong Spring Boot.
    /// </summary>
    public class PaginatedResponse<T>
    {
        public List<T> Content { get; set; } = new();
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalElements { get; set; }
        public int TotalPages { get; set; }
        public bool IsFirst { get; set; }
        public bool IsLast { get; set; }

        public PaginatedResponse(List<T> content, int pageNumber, int pageSize, int totalElements)
        {
            Content = content;
            PageNumber = pageNumber;
            PageSize = pageSize;
            TotalElements = totalElements;
            TotalPages = (int)Math.Ceiling((double)totalElements / pageSize);
            IsFirst = pageNumber == 1;
            IsLast = pageNumber >= TotalPages;
        }
    }
}
