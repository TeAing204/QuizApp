// ===== User DTOs (khớp backend UserViewModel/CreateDto/EditDto) =====

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

export interface UserCreateDto {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  password: string;
  confirmPassword: string;
  isActive: boolean;
  roleId?: string;
}

/** Không có password — Admin không thể sửa mật khẩu user (theo spec Task 5) */
export interface UserEditDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  isActive: boolean;
  roleId?: string;
}
