namespace QuizApp.WebAPI.Exceptions
{
    // Maps to HTTP 404 Not Found.
    public class NotFoundException : Exception
    {
        public NotFoundException(string message) : base(message) { }

        public NotFoundException(string entityName, object key)
            : base($"{entityName} with id '{key}' was not found.") { }
    }
}
