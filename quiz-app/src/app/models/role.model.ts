// ===== Role DTOs (khớp backend RoleViewModel/CreateDto/EditDto) =====

export interface RoleViewModel {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface RoleCreateDto {
  name: string;
  description?: string;
  isActive: boolean;
}

export interface RoleEditDto {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}
