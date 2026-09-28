import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoleService } from '../../../../services/role.service';
import { RoleCreateDto, RoleEditDto } from '../../../../models/role.model';

@Component({
  selector: 'app-admin-role-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './role-form.component.html'
})
export class AdminRoleFormComponent implements OnInit {
  isEditMode = false;
  roleId = '';
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  formData = {
    name: '',
    description: '',
    isActive: true
  };

  constructor(
    private roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.roleId = id;
      this.loadRole();
    }
  }

  loadRole(): void {
    this.isLoading = true;
    this.roleService.getById(this.roleId).subscribe({
      next: (role) => {
        this.formData = {
          name: role.name,
          description: role.description || '',
          isActive: role.isActive
        };
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load role details.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.formData.name.trim()) {
      this.errorMessage = 'Please enter role name.';
      return;
    }

    this.isSaving = true;

    if (this.isEditMode) {
      const dto: RoleEditDto = {
        id: this.roleId,
        name: this.formData.name,
        description: this.formData.description || undefined,
        isActive: this.formData.isActive
      };
      this.roleService.update(this.roleId, dto).subscribe({
        next: () => {
          this.isSaving = false;
          this.successMessage = 'Role updated successfully!';
          setTimeout(() => this.router.navigate(['/admin/roles']), 1500);
        },
        error: (err) => {
          this.isSaving = false;
          this.errorMessage = err.error?.message || 'Update failed.';
        }
      });
    } else {
      const dto: RoleCreateDto = {
        name: this.formData.name,
        description: this.formData.description || undefined,
        isActive: this.formData.isActive
      };
      this.roleService.create(dto).subscribe({
        next: () => {
          this.isSaving = false;
          this.successMessage = 'Role created successfully!';
          setTimeout(() => this.router.navigate(['/admin/roles']), 1500);
        },
        error: (err) => {
          this.isSaving = false;
          this.errorMessage = err.error?.message || 'Failed to create role.';
        }
      });
    }
  }
}
