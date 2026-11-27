import axiosInstance from "../../lib/axiosInstance";
import type { AuthResponse, AuthUser, LoginApiResponse, UserRole } from "../../types/auth.types";
import { tokenStorage } from "../../utils/tokenStorage";
import type { LoginFormValues, RegisterFormValues } from "../../validation/auth.chema";

const toAuthUser = (data: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive?: boolean;
}): AuthUser => ({
  id: data.id,
  firstName: data.firstName,
  lastName: data.lastName,
  email: data.email,
  role: data.role as UserRole,
  isActive: data.isActive ?? true,
});

export const loginRequest = async (payload: LoginFormValues): Promise<AuthResponse> => {
  const res = await axiosInstance.post<LoginApiResponse>("/auth/login", {
    email: payload.identifier,
    password: payload.password,
  });

  const { accessToken, refreshToken } = res.data.data;
tokenStorage.setTokens(accessToken, refreshToken);

  return { user: toAuthUser(res.data.data), token: accessToken };
};

export const registerRequest = async (payload: RegisterFormValues): Promise<AuthResponse> => {
  await axiosInstance.post("/auth/register", {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    password: payload.password,
    confirmPassword: payload.confirmPassword,
  });

  return loginRequest({ identifier: payload.email, password: payload.password, remember: false });
};

export const persistSession = (auth: AuthResponse, remember: boolean) => {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("auth_user", JSON.stringify(auth.user));
};

export const getRedirectPathByRole = (role: UserRole): string =>
  role === "Admin" ? "/admin" : "/";

export const logout = async () => {
  try {
    const refreshToken = tokenStorage.getRefresh();
    await axiosInstance.post("/auth/revoke-token", { refreshToken });
  } catch {
    // token artıq keçibsə belə localdan təmizlə
  } finally {
    tokenStorage.clear();
  }
};