import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { RoleService } from '../../../../services/role.service';
import { UserCreateDto, UserEditDto } from '../../../../models/user.model';
import { RoleViewModel } from '../../../../models/role.model';

@Component({
  selector: 'app-admin-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-form.component.html'
})
export class AdminUserFormComponent implements OnInit {
  isEditMode = false;
  userId = '';
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  successMessage = '';
  roles: RoleViewModel[] = [];

  formData: any = {
    firstName: '',
    lastName: '',
    email: '',
    userName: '',
    phoneNumber: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
    isActive: true,
    roleId: ''
  };

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.userId = id;
      this.loadUser();
    }
  }

  loadRoles(): void {
    this.roleService.getAll({ pageSize: 100 }).subscribe({
      next: (res) => this.roles = res.content.filter(r => r.isActive),
      error: () => {} // Roles might not be available
    });
  }

  loadUser(): void {
    this.isLoading = true;
    this.userService.getById(this.userId).subscribe({
      next: (user) => {
        this.formData = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          userName: user.userName,
          phoneNumber: user.phoneNumber || '',
          dateOfBirth: user.dateOfBirth ? user.dateOfBirth.substring(0, 10) : '',
          isActive: user.isActive,
          roleId: '',
          password: '',
          confirmPassword: ''
        };
        // Try to match role name to roleId
        const matchedRole = this.roles.find(r => r.name === user.roles);
        if (matchedRole) {
          this.formData.roleId = matchedRole.id;
        }
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Không thể tải thông tin user.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Validation
    if (!this.formData.firstName.trim() || !this.formData.lastName.trim()) {
      this.errorMessage = 'Vui lòng nhập họ và tên.';
      return;
    }
    if (!this.formData.email.trim()) {
      this.errorMessage = 'Vui lòng nhập email.';
      return;
    }
    if (!this.formData.userName.trim()) {
      this.errorMessage = 'Vui lòng nhập username.';
      return;
    }

    if (!this.isEditMode) {
      if (!this.formData.password || this.formData.password.length < 6) {
        this.errorMessage = 'Mật khẩu phải có ít nhất 6 ký tự.';
        return;
      }
      if (this.formData.password !== this.formData.confirmPassword) {
        this.errorMessage = 'Mật khẩu xác nhận không khớp.';
        return;
      }
    }

    this.isSaving = true;

    if (this.isEditMode) {
      const dto: UserEditDto = {
        id: this.userId,
        firstName: this.formData.firstName,
        lastName: this.formData.lastName,
        email: this.formData.email,
        userName: this.formData.userName,
        phoneNumber: this.formData.phoneNumber || undefined,
        dateOfBirth: this.formData.dateOfBirth || undefined,
        isActive: this.formData.isActive,
        roleId: this.formData.roleId || undefined
      };
      this.userService.update(this.userId, dto).subscribe({
        next: () => {
          this.isSaving = false;
          this.successMessage = 'Cập nhật user thành công!';
          setTimeout(() => this.router.navigate(['/admin/users']), 1500);
        },
        error: (err) => {
          this.isSaving = false;
          this.errorMessage = err.error?.message || 'Cập nhật thất bại.';
        }
      });
    } else {
      const dto: UserCreateDto = {
        firstName: this.formData.firstName,
        lastName: this.formData.lastName,
        email: this.formData.email,
        userName: this.formData.userName,
        phoneNumber: this.formData.phoneNumber || undefined,
        dateOfBirth: this.formData.dateOfBirth || undefined,
        password: this.formData.password,
        confirmPassword: this.formData.confirmPassword,
        isActive: this.formData.isActive,
        roleId: this.formData.roleId || undefined
      };
      this.userService.create(dto).subscribe({
        next: () => {
          this.isSaving = false;
          this.successMessage = 'Tạo user thành công!';
          setTimeout(() => this.router.navigate(['/admin/users']), 1500);
        },
        error: (err) => {
          this.isSaving = false;
          this.errorMessage = err.error?.message || 'Tạo user thất bại.';
        }
      });
    }
  }
}
