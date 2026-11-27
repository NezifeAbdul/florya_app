import { logout } from "../services/api/authService";
import { tokenStorage } from "./tokenStorage";

export interface AdminSession {
  name: string;
  email: string;
}

const readUser = () => {
  try {
    const raw = localStorage.getItem("auth_user") ?? sessionStorage.getItem("auth_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getAdminSession = (): AdminSession | null => {
  const user = readUser();
  const token = tokenStorage.getAccess();
  if (!user || !token || user.role !== "Admin") return null;
  return {
    name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email,
    email: user.email,
  };
};

export const logoutAdmin = async () => {
  await logout();
  window.location.href = "/";
};
