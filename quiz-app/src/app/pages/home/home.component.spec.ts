import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { HomeComponent } from './home.component';
import { QuizService } from '../../services/quiz.service';
import { AuthService } from '../../services/auth.service';
import { QuizViewModel } from '../../models/quiz.model';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let quizServiceSpy: jasmine.SpyObj<QuizService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockQuizzes: QuizViewModel[] = [
    { id: '1', title: 'Angular Quiz', description: 'Test Angular', duration: 30, isActive: true, numberOfQuestions: 10 },
    { id: '2', title: 'TypeScript Quiz', description: 'Test TS', duration: 20, isActive: true, numberOfQuestions: 5 },
    { id: '3', title: 'Inactive Quiz', description: 'Hidden', duration: 15, isActive: false, numberOfQuestions: 3 }
  ];

  beforeEach(async () => {
    quizServiceSpy = jasmine.createSpyObj('QuizService', ['getAll']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'isAdmin', 'getCurrentUser']);

    // Default: return mock quizzes
    quizServiceSpy.getAll.and.returnValue(of(mockQuizzes));
    authServiceSpy.isLoggedIn.and.returnValue(false);
    authServiceSpy.isAdmin.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [HomeComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: QuizService, useValue: quizServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call QuizService.getAll() on init', () => {
    fixture.detectChanges(); // triggers ngOnInit
    expect(quizServiceSpy.getAll).toHaveBeenCalledTimes(1);
  });

  it('should populate quizzes with only active quizzes after load', () => {
    fixture.detectChanges();
    // mockQuizzes has 3 items but only 2 are isActive: true
    expect(component.quizzes.length).toBe(2);
    expect(component.quizzes.every(q => q.isActive)).toBeTrue();
  });

  it('should filter out inactive quizzes', () => {
    fixture.detectChanges();
    const inactiveQuiz = component.quizzes.find(q => q.id === '3');
    expect(inactiveQuiz).toBeUndefined();
  });

  it('should set isLoading to false after data loads', () => {
    expect(component.isLoading).toBeTrue(); // before init
    fixture.detectChanges();
    expect(component.isLoading).toBeFalse();
  });

  it('should set isLoading to false even on error', () => {
    quizServiceSpy.getAll.and.returnValue(throwError(() => new Error('Network error')));
    fixture.detectChanges();
    expect(component.isLoading).toBeFalse();
  });

  it('should have empty quizzes array when API returns empty', () => {
    quizServiceSpy.getAll.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component.quizzes.length).toBe(0);
  });

  it('should have empty quizzes array when all quizzes are inactive', () => {
    const allInactive: QuizViewModel[] = [
      { id: '1', title: 'Q1', description: '', duration: 10, isActive: false, numberOfQuestions: 1 }
    ];
    quizServiceSpy.getAll.and.returnValue(of(allInactive));
    fixture.detectChanges();
    expect(component.quizzes.length).toBe(0);
  });

  it('should render quiz titles in the template', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const html = compiled.innerHTML;
    expect(html).toContain('Angular Quiz');
    expect(html).toContain('TypeScript Quiz');
  });

  it('should NOT render inactive quiz title in the template', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.innerHTML).not.toContain('Inactive Quiz');
  });
});
