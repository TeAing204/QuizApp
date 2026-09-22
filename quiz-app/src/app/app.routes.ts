import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { QuizzesComponent } from './pages/quizzes/quizzes.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { AdminLayoutComponent } from './pages/admin/admin-layout/admin-layout.component';
import { AdminQuizListComponent } from './pages/admin/quiz/quiz-list/quiz-list.component';
import { AdminQuizFormComponent } from './pages/admin/quiz/quiz-form/quiz-form.component';
import { AdminQuestionListComponent } from './pages/admin/question/question-list/question-list.component';
import { AdminQuestionFormComponent } from './pages/admin/question/question-form/question-form.component';
import { AdminQuizQuestionsComponent } from './pages/admin/quiz/quiz-questions/quiz-questions.component';
import { CreateHubComponent } from './pages/admin/create-hub/create-hub.component';
import { AdminUserListComponent } from './pages/admin/user/user-list/user-list.component';
import { AdminUserFormComponent } from './pages/admin/user/user-form/user-form.component';
import { AdminRoleListComponent } from './pages/admin/role/role-list/role-list.component';
import { AdminRoleFormComponent } from './pages/admin/role/role-form/role-form.component';
import { QuizPrepareComponent } from './pages/quiz/quiz-prepare/quiz-prepare.component';
import { QuizTakeComponent } from './pages/quiz/quiz-take/quiz-take.component';
import { QuizResultComponent } from './pages/quiz/quiz-result/quiz-result.component';
import { QuizHistoryComponent } from './pages/quiz/quiz-history/quiz-history.component';
import { QuizReviewComponent } from './pages/quiz/quiz-review/quiz-review.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  // ===== PUBLIC PAGES =====
  { path: '', component: HomeComponent, title: 'QuizApp - Home' },
  { path: 'about', component: AboutComponent, title: 'QuizApp - About' },
  { path: 'quizzes', component: QuizzesComponent, title: 'QuizApp - Quizzes' },
  { path: 'contact', component: ContactComponent, title: 'QuizApp - Contact' },
  { path: 'forbidden', component: ForbiddenComponent, title: 'QuizApp - 403 Forbidden' },

  // ===== AUTHENTICATION =====
  { path: 'auth/login', component: LoginComponent, title: 'QuizApp - Login' },
  { path: 'auth/register', component: RegisterComponent, title: 'QuizApp - Register' },

  // ===== ADMIN ROUTES (protected, nested under AdminLayout) =====
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'create', pathMatch: 'full' },
      { path: 'create', component: CreateHubComponent, title: 'Admin - Tạo mới' },
      { path: 'quizzes', component: AdminQuizListComponent, title: 'Admin - Quizzes' },
      { path: 'quizzes/create', component: AdminQuizFormComponent, title: 'Admin - Create Quiz' },
      { path: 'quizzes/:id/edit', component: AdminQuizFormComponent, title: 'Admin - Edit Quiz' },
      { path: 'quizzes/:id/questions', component: AdminQuizQuestionsComponent, title: 'Admin - Quiz Questions' },
      { path: 'questions', component: AdminQuestionListComponent, title: 'Admin - Questions' },
      { path: 'questions/create', component: AdminQuestionFormComponent, title: 'Admin - Create Question' },
      { path: 'questions/:id/edit', component: AdminQuestionFormComponent, title: 'Admin - Edit Question' },
      { path: 'users', component: AdminUserListComponent, title: 'Admin - Users' },
      { path: 'users/create', component: AdminUserFormComponent, title: 'Admin - Create User' },
      { path: 'users/:id/edit', component: AdminUserFormComponent, title: 'Admin - Edit User' },
      { path: 'roles', component: AdminRoleListComponent, title: 'Admin - Roles' },
      { path: 'roles/create', component: AdminRoleFormComponent, title: 'Admin - Create Role' },
      { path: 'roles/:id/edit', component: AdminRoleFormComponent, title: 'Admin - Edit Role' }
    ]
  },

  // ===== USER QUIZ-TAKING FLOW (protected) =====
  { path: 'quiz/history', component: QuizHistoryComponent, canActivate: [authGuard], title: 'QuizApp - Lịch sử làm bài' },
  { path: 'quiz/review/:attemptId', component: QuizReviewComponent, canActivate: [authGuard], title: 'QuizApp - Xem lại bài làm' },
  { path: 'quiz/:id/prepare', component: QuizPrepareComponent, canActivate: [authGuard], title: 'Chuẩn bị làm bài' },
  { path: 'quiz/:id/take', component: QuizTakeComponent, canActivate: [authGuard], title: 'Làm bài' },
  { path: 'quiz/:id/result', component: QuizResultComponent, canActivate: [authGuard], title: 'Kết quả' },

  // ===== USER PROFILE (protected) =====
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard], title: 'QuizApp - Hồ sơ cá nhân' },

  // ===== FALLBACK =====
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
