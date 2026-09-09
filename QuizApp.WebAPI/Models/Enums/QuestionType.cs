namespace QuizApp.WebAPI.Models.Enums
{
    /// <summary>
    /// Các loại câu hỏi được hỗ trợ trong hệ thống quiz.
    /// </summary>
    public enum QuestionType
    {
        SingleChoice,
        MultipleChoice,
        TrueFalse,
        FillInTheBlanks,
        ShortAnswer,
        LongAnswer
    }
}
