export interface LoginDto {
  userName: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  password: string;
  confirmPassword: string;
}

export interface UserViewModel {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  userName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  avatar?: string;
  isActive: boolean;
  roles: string;
}

export interface LoginResponse {
  userInformation: UserViewModel;
  token: string;
  expires: string;
}
