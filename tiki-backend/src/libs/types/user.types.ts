import type { users } from 'prisma/generated/client';

export interface User extends users {}

export interface UserFilter {
  email?: string;
  username?: string;
  fullName?: string;
  phoneNumber?: string;
  sortByName?: 'asc' | 'desc';
  sortByDate?: 'newest' | 'oldest';
  limit?: number;
  offset?: number;
}

export interface UserCreateInput {
  uuid: string;
  username: string;
  email: string;
  fullName: string;
  password: string;
  phoneNumber?: string;
  ward?: string;
  district?: string;
  province?: string;
  typeAddress?: string;
  address?: string;
  role?: number;
  avatar?: string;
  gender?: boolean;
  dayOfBirth?: Date;
  isPublic?: boolean;
  isActivated?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserUpdateInput {
  fullName?: string;
  password?: string;
  phoneNumber?: string;
  ward?: string;
  district?: string;
  province?: string;
  address?: string;
  typeAddress?: string;
}

export interface UserRequestType {
  uuid: string;
  username: string;
  email: string;
  password?: string;
  fullName: string;
  ward?: string;
  district?: string;
  province?: string;
  address?: string;
  typeAddress?: string;
  phoneNumber?: string;
  dayOfBirth?: string | Date;
  gender?: number | boolean;
  avatar?: string;
  role?: number | boolean;
  isPublic?: number | boolean;
  isActivated?: number | boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface UserResponseType {
  uuid: string;
  username: string;
  fullName: string;
  email: string;
  address?: string;
  phoneNumber?: string;
  typeAddress?: string;
  ward?: string;
  province?: string;
  district?: string;
  dayOfBirth?: string | Date;
  isPublic?: number | boolean;
  gender?: number | boolean;
  role?: number | boolean;
  avatar?: string;
  createdAt?: string | Date;
  token?: string | null;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  totalPages: number;
  totalElements: number;
}

export interface UserPaginatedResponse {
  pagination: PaginationResponse;
  users: UserResponseType[];
}

export interface LoginRequest {
  username?: string;
  email?: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export interface PasswordResetRequest {
  password: string;
}

export interface EmailRequest {
  email: string;
}
