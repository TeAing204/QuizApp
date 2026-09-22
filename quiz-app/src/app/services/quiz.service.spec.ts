import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { QuizService } from './quiz.service';
import { environment } from '../../environments/environment';
import {
  QuizViewModel, QuizCreateDto, QuizEditDto,
  PrepareQuizDto, QuizPrepareInfoDto,
  TakeQuizDto, QuizForTestDto,
  QuizSubmissionDto, QuizResultDto,
  QuizHistoryDto
} from '../models/quiz.model';

describe('QuizService', () => {
  let service: QuizService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/quizzes`;

  // Sample data
  const mockQuiz: QuizViewModel = {
    id: 'quiz-1', title: 'Test Quiz', description: 'A test quiz',
    duration: 30, isActive: true, numberOfQuestions: 5
  };

  const mockQuizList: QuizViewModel[] = [mockQuiz,
    { id: 'quiz-2', title: 'Quiz 2', description: '', duration: 20, isActive: false, numberOfQuestions: 3 }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QuizService]
    });
    service = TestBed.inject(QuizService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify no pending requests
  });

  // ===== getAll() =====
  describe('getAll()', () => {
    it('should return an array of QuizViewModels', () => {
      service.getAll().subscribe(quizzes => {
        expect(quizzes.length).toBe(2);
        expect(quizzes[0].id).toBe('quiz-1');
        expect(quizzes[1].title).toBe('Quiz 2');
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockQuizList);
    });

    it('should send GET request to the correct URL', () => {
      service.getAll().subscribe();
      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  // ===== getById() =====
  describe('getById()', () => {
    it('should return a single QuizViewModel by id', () => {
      service.getById('quiz-1').subscribe(quiz => {
        expect(quiz.id).toBe('quiz-1');
        expect(quiz.title).toBe('Test Quiz');
      });

      const req = httpMock.expectOne(`${apiUrl}/quiz-1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockQuiz);
    });

    it('should call GET with correct URL', () => {
      service.getById('quiz-99').subscribe();
      const req = httpMock.expectOne(`${apiUrl}/quiz-99`);
      expect(req.request.method).toBe('GET');
      req.flush(null);
    });
  });

  // ===== create() =====
  describe('create()', () => {
    it('should return true on successful creation', () => {
      const dto: QuizCreateDto = {
        title: 'New Quiz', description: 'desc', duration: 15, isActive: true
      };

      service.create(dto).subscribe(result => {
        expect(result).toBeTrue();
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      req.flush(true);
    });

    it('should send the correct DTO in request body', () => {
      const dto: QuizCreateDto = {
        title: 'Quiz X', description: '', duration: 60, isActive: false
      };

      service.create(dto).subscribe();
      const req = httpMock.expectOne(apiUrl);
      expect(req.request.body.title).toBe('Quiz X');
      expect(req.request.body.duration).toBe(60);
      req.flush(true);
    });
  });

  // ===== update() =====
  describe('update()', () => {
    it('should return true on successful update', () => {
      const dto: QuizEditDto = {
        id: 'quiz-1', title: 'Updated', description: 'upd', duration: 45, isActive: true
      };

      service.update('quiz-1', dto).subscribe(result => {
        expect(result).toBeTrue();
      });

      const req = httpMock.expectOne(`${apiUrl}/quiz-1`);
      expect(req.request.method).toBe('PUT');
      req.flush(true);
    });

    it('should call PUT with correct URL', () => {
      const dto: QuizEditDto = { id: 'quiz-2', title: 'Q2', description: '', duration: 10, isActive: false };
      service.update('quiz-2', dto).subscribe();
      const req = httpMock.expectOne(`${apiUrl}/quiz-2`);
      expect(req.request.method).toBe('PUT');
      req.flush(false);
    });
  });

  // ===== delete() =====
  describe('delete()', () => {
    it('should return true on successful deletion', () => {
      service.delete('quiz-1').subscribe(result => {
        expect(result).toBeTrue();
      });

      const req = httpMock.expectOne(`${apiUrl}/quiz-1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(true);
    });

    it('should call DELETE with correct URL', () => {
      service.delete('quiz-99').subscribe();
      const req = httpMock.expectOne(`${apiUrl}/quiz-99`);
      expect(req.request.method).toBe('DELETE');
      req.flush(true);
    });
  });

  // ===== prepareQuiz() =====
  describe('prepareQuiz()', () => {
    it('should return QuizPrepareInfoDto', () => {
      const dto: PrepareQuizDto = { userId: 'user-1', quizId: 'quiz-1' };
      const mockResponse: QuizPrepareInfoDto = {
        id: 'quiz-1', title: 'Test Quiz', duration: 30,
        user: {
          id: 'user-1', firstName: 'John', lastName: 'Doe',
          displayName: 'John Doe', email: 'john@test.com',
          userName: 'johndoe', isActive: true, roles: 'User'
        }
      };

      service.prepareQuiz(dto).subscribe(info => {
        expect(info.id).toBe('quiz-1');
        expect(info.user.id).toBe('user-1');
      });

      const req = httpMock.expectOne(`${apiUrl}/prepare`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      req.flush(mockResponse);
    });
  });

  // ===== takeQuiz() =====
  describe('takeQuiz()', () => {
    it('should return QuizForTestDto with questions', () => {
      const dto: TakeQuizDto = { userId: 'user-1', quizId: 'quiz-1' };
      const mockResponse: QuizForTestDto = {
        id: 'quiz-1', title: 'Test Quiz', duration: 30,
        startTime: new Date().toISOString(), questions: []
      };

      service.takeQuiz(dto).subscribe(testData => {
        expect(testData.id).toBe('quiz-1');
        expect(testData.questions).toBeDefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/take`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  // ===== submitQuiz() =====
  describe('submitQuiz()', () => {
    it('should return QuizResultDto with score', () => {
      const dto: QuizSubmissionDto = {
        quizId: 'quiz-1', userId: 'user-1', answers: []
      };
      const mockResult: QuizResultDto = {
        quizAttemptId: 'attempt-1', quizId: 'quiz-1',
        quizTitle: 'Test Quiz', score: 80,
        totalQuestions: 5, correctAnswers: 4,
        submittedAt: new Date().toISOString()
      };

      service.submitQuiz(dto).subscribe(result => {
        expect(result.score).toBe(80);
        expect(result.correctAnswers).toBe(4);
        expect(result.totalQuestions).toBe(5);
      });

      const req = httpMock.expectOne(`${apiUrl}/submit`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResult);
    });
  });

  // ===== getHistory() =====
  describe('getHistory()', () => {
    it('should return array of QuizHistoryDto for userId', () => {
      const mockHistory: QuizHistoryDto[] = [
        {
          quizAttemptId: 'attempt-1', quizId: 'quiz-1',
          quizTitle: 'Test Quiz', duration: 30,
          score: 75, totalQuestions: 4, correctAnswers: 3,
          startTime: new Date().toISOString(),
          submittedAt: new Date().toISOString(),
          status: 'Completed'
        }
      ];

      service.getHistory('user-1').subscribe(history => {
        expect(history.length).toBe(1);
        expect(history[0].score).toBe(75);
        expect(history[0].status).toBe('Completed');
      });

      const req = httpMock.expectOne(`${apiUrl}/history/user-1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockHistory);
    });

    it('should return empty array when no history', () => {
      service.getHistory('new-user').subscribe(history => {
        expect(history.length).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}/history/new-user`);
      req.flush([]);
    });
  });

  // ===== getQuestions() =====
  describe('getQuestions()', () => {
    it('should call GET /quizzes/{id}/questions', () => {
      service.getQuestions('quiz-1').subscribe();
      const req = httpMock.expectOne(`${apiUrl}/quiz-1/questions`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  // ===== addQuestion() =====
  describe('addQuestion()', () => {
    it('should call POST /quizzes/{quizId}/questions', () => {
      service.addQuestion({ quizId: 'quiz-1', questionId: 'q-1' }).subscribe();
      const req = httpMock.expectOne(`${apiUrl}/quiz-1/questions`);
      expect(req.request.method).toBe('POST');
      req.flush(true);
    });
  });

  // ===== removeQuestion() =====
  describe('removeQuestion()', () => {
    it('should call DELETE /quizzes/{quizId}/questions/{quizQuestionId}', () => {
      service.removeQuestion('quiz-1', 'qq-1').subscribe();
      const req = httpMock.expectOne(`${apiUrl}/quiz-1/questions/qq-1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(true);
    });
  });
});
