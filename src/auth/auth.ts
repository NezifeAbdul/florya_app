import { tokenStorage } from "./tokenStorage";

const getToken = () => tokenStorage.getAccess();
export const isLoggedIn = () => !!getToken();

const readPayload = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

export const getUserId = (): string | null => {
  if (!getToken()) return null;
  const p = readPayload();
  if (!p) return "user";
  return String(
    p.sub ??
      p.nameid ??
      p["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ??
      p.email ??
      "user"
  );
};

export const getRole = (): string | null => {
  const p = readPayload();
  if (!p) return null;
  const role = p.role ?? p["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  return Array.isArray(role) ? role[0] : role ?? null;
};

export const isAdmin = () => getRole() === "Admin";
