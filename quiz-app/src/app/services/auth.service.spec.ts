import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { LoginDto, RegisterDto, LoginResponse, UserViewModel } from '../models/auth.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/auth`;

  const mockUser: UserViewModel = {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    displayName: 'John Doe',
    email: 'john@example.com',
    userName: 'johndoe',
    isActive: true,
    roles: 'User'
  };

  const mockAdminUser: UserViewModel = {
    ...mockUser,
    id: 'admin-1',
    roles: 'Administrator'
  };

  const futureDate = new Date();
  futureDate.setHours(futureDate.getHours() + 24);

  const mockLoginResponse: LoginResponse = {
    userInformation: mockUser,
    token: 'fake-jwt-token-12345',
    expires: futureDate.toISOString()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  // ===== login() =====
  describe('login()', () => {
    const loginDto: LoginDto = { userName: 'johndoe', password: 'Password@123' };

    it('should call POST /auth/login with credentials', () => {
      service.login(loginDto).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginDto);
      req.flush(mockLoginResponse);
    });

    it('should store token in localStorage on success', () => {
      service.login(loginDto).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/login`);
      req.flush(mockLoginResponse);

      expect(localStorage.getItem('token')).toBe('fake-jwt-token-12345');
    });

    it('should store user info in localStorage on success', () => {
      service.login(loginDto).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/login`);
      req.flush(mockLoginResponse);

      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      expect(storedUser.id).toBe('user-1');
      expect(storedUser.userName).toBe('johndoe');
    });

    it('should store token expiry in localStorage on success', () => {
      service.login(loginDto).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/login`);
      req.flush(mockLoginResponse);

      expect(localStorage.getItem('token_expires')).toBe(mockLoginResponse.expires);
    });

    it('should emit userInformation via currentUser$ on success', () => {
      let emittedUser: UserViewModel | null = null;

      service.login(loginDto).subscribe();
      service.currentUser$.subscribe(u => emittedUser = u);

      const req = httpMock.expectOne(`${apiUrl}/login`);
      req.flush(mockLoginResponse);

      expect(emittedUser).not.toBeNull();
      expect(emittedUser!.id).toBe('user-1');
    });

    it('should return the login response observable', () => {
      let result: LoginResponse | null = null;

      service.login(loginDto).subscribe(res => result = res);

      const req = httpMock.expectOne(`${apiUrl}/login`);
      req.flush(mockLoginResponse);

      expect(result).not.toBeNull();
      expect(result!.token).toBe('fake-jwt-token-12345');
    });
  });

  // ===== register() =====
  describe('register()', () => {
    const registerDto: RegisterDto = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      userName: 'janesmith',
      password: 'Password@123',
      confirmPassword: 'Password@123'
    };

    const mockRegisterResponse: LoginResponse = {
      userInformation: {
        ...mockUser,
        id: 'user-new',
        firstName: 'Jane',
        lastName: 'Smith',
        displayName: 'Jane Smith',
        email: 'jane@example.com',
        userName: 'janesmith'
      },
      token: 'new-user-token',
      expires: futureDate.toISOString()
    };

    it('should call POST /auth/register with user data', () => {
      service.register(registerDto).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerDto);
      req.flush(mockRegisterResponse);
    });

    it('should store token in localStorage after registration', () => {
      service.register(registerDto).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/register`);
      req.flush(mockRegisterResponse);

      expect(localStorage.getItem('token')).toBe('new-user-token');
    });

    it('should emit the new user via currentUser$ after registration', () => {
      let emittedUser: UserViewModel | null = null;
      service.currentUser$.subscribe(u => emittedUser = u);

      service.register(registerDto).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/register`);
      req.flush(mockRegisterResponse);

      expect(emittedUser).not.toBeNull();
      expect(emittedUser!.userName).toBe('janesmith');
    });
  });

  // ===== isLoggedIn() =====
  describe('isLoggedIn()', () => {
    it('should return false when no token in localStorage', () => {
      localStorage.clear();
      expect(service.isLoggedIn()).toBeFalse();
    });

    it('should return true when token exists and not expired', () => {
      localStorage.setItem('token', 'valid-token');
      localStorage.setItem('token_expires', futureDate.toISOString());
      expect(service.isLoggedIn()).toBeTrue();
    });

    it('should return false and call logout when token is expired', () => {
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 1);

      localStorage.setItem('token', 'expired-token');
      localStorage.setItem('token_expires', pastDate.toISOString());
      localStorage.setItem('user', JSON.stringify(mockUser));

      expect(service.isLoggedIn()).toBeFalse();
      // After auto-logout, token should be removed
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('should return true when token exists but no expiry set', () => {
      localStorage.setItem('token', 'some-token');
      // No token_expires set
      expect(service.isLoggedIn()).toBeTrue();
    });
  });

  // ===== isAdmin() =====
  describe('isAdmin()', () => {
    it('should return true for Administrator role', () => {
      service.login({ userName: 'admin', password: 'pass' }).subscribe();
      const req = httpMock.expectOne(`${apiUrl}/login`);
      req.flush({ ...mockLoginResponse, userInformation: mockAdminUser });

      expect(service.isAdmin()).toBeTrue();
    });

    it('should return false for non-Administrator role', () => {
      service.login({ userName: 'user', password: 'pass' }).subscribe();
      const req = httpMock.expectOne(`${apiUrl}/login`);
      req.flush(mockLoginResponse); // mockUser has roles: 'User'

      expect(service.isAdmin()).toBeFalse();
    });

    it('should return false when no user is logged in', () => {
      // Fresh state: no user
      expect(service.isAdmin()).toBeFalse();
    });
  });

  // ===== logout() =====
  describe('logout()', () => {
    it('should remove token from localStorage', () => {
      localStorage.setItem('token', 'some-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token_expires', futureDate.toISOString());

      service.logout();

      expect(localStorage.getItem('token')).toBeNull();
    });

    it('should remove user from localStorage', () => {
      localStorage.setItem('user', JSON.stringify(mockUser));

      service.logout();

      expect(localStorage.getItem('user')).toBeNull();
    });

    it('should emit null via currentUser$ after logout', () => {
      // First login
      service.login({ userName: 'johndoe', password: 'pass' }).subscribe();
      const req = httpMock.expectOne(`${apiUrl}/login`);
      req.flush(mockLoginResponse);

      // Then logout
      let emittedUser: UserViewModel | null = mockUser;
      service.currentUser$.subscribe(u => emittedUser = u);
      service.logout();

      expect(emittedUser).toBeNull();
    });
  });

  // ===== getCurrentUser() =====
  describe('getCurrentUser()', () => {
    it('should return null when not logged in', () => {
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should return user after successful login', () => {
      service.login({ userName: 'johndoe', password: 'pass' }).subscribe();
      const req = httpMock.expectOne(`${apiUrl}/login`);
      req.flush(mockLoginResponse);

      const user = service.getCurrentUser();
      expect(user).not.toBeNull();
      expect(user!.id).toBe('user-1');
    });
  });

  // ===== getToken() =====
  describe('getToken()', () => {
    it('should return null when no token stored', () => {
      localStorage.clear();
      expect(service.getToken()).toBeNull();
    });

    it('should return token from localStorage', () => {
      localStorage.setItem('token', 'my-token-123');
      expect(service.getToken()).toBe('my-token-123');
    });
  });
});
