export type UserRole = "Admin" | "User";
export type AuthMode = "login" | "register";

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

// /api/auth/login cavabı
export interface LoginApiResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    id: string;
  };
  message: string | null;
  errors: string[] | null;
}

// /api/auth/register cavabı
export interface RegisterApiResponse {
  success: boolean;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
    postalCode: string | null;
    role: string;
    isActive: boolean;
    createdAt: string;
  };
  message: string | null;
  errors: string[] | null;
}