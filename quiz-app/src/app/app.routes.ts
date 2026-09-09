import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { AdminQuizListComponent } from './pages/admin/quiz/quiz-list/quiz-list.component';
import { AdminQuizFormComponent } from './pages/admin/quiz/quiz-form/quiz-form.component';
import { AdminQuestionListComponent } from './pages/admin/question/question-list/question-list.component';
import { AdminQuizQuestionsComponent } from './pages/admin/quiz/quiz-questions/quiz-questions.component';
import { CreateHubComponent } from './pages/admin/create-hub/create-hub.component';
import { QuizPrepareComponent } from './pages/quiz/quiz-prepare/quiz-prepare.component';
import { QuizTakeComponent } from './pages/quiz/quiz-take/quiz-take.component';
import { QuizResultComponent } from './pages/quiz/quiz-result/quiz-result.component';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'QuizApp - Home' },
  { path: 'about', component: AboutComponent, title: 'QuizApp - About' },
  { path: 'auth/login', component: LoginComponent, title: 'QuizApp - Login' },
  { path: 'auth/register', component: RegisterComponent, title: 'QuizApp - Register' },

  // Admin routes (protected)
  { path: 'admin/create', component: CreateHubComponent, canActivate: [adminGuard], title: 'Admin - Tạo mới' },
  { path: 'admin/quizzes', component: AdminQuizListComponent, canActivate: [adminGuard], title: 'Admin - Quizzes' },
  { path: 'admin/quizzes/create', component: AdminQuizFormComponent, canActivate: [adminGuard], title: 'Admin - Create Quiz' },
  { path: 'admin/quizzes/:id/edit', component: AdminQuizFormComponent, canActivate: [adminGuard], title: 'Admin - Edit Quiz' },
  { path: 'admin/quizzes/:id/questions', component: AdminQuizQuestionsComponent, canActivate: [adminGuard], title: 'Admin - Quiz Questions' },
  { path: 'admin/questions', component: AdminQuestionListComponent, canActivate: [adminGuard], title: 'Admin - Questions' },

  // User Quiz Taking Flow (protected — phải đăng nhập)
  { path: 'quiz/:id/prepare', component: QuizPrepareComponent, canActivate: [authGuard], title: 'Chuẩn bị làm bài' },
  { path: 'quiz/:id/take', component: QuizTakeComponent, canActivate: [authGuard], title: 'Làm bài' },
  { path: 'quiz/:id/result', component: QuizResultComponent, canActivate: [authGuard], title: 'Kết quả' },

  { path: '**', redirectTo: '', pathMatch: 'full' }
];
