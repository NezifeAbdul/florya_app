import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./authContext";
import type { AuthContextValue } from "./authContext";
import { AUTH_EVENT, tokenStorage } from "../utils/tokenStorage";
import { getRole, getUserId } from "../utils/auth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(tokenStorage.getAccess);

  useEffect(() => {
    const sync = () => setToken(tokenStorage.getAccess());
    window.addEventListener(AUTH_EVENT, sync);
    window.addEventListener("storage", sync);
    sync();
    return () => {
      window.removeEventListener(AUTH_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const login = useCallback((accessToken: string, refreshToken?: string) => {
    tokenStorage.setTokens(accessToken, refreshToken);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const role = token ? getRole() : null;
    return {
      token,
      isLoggedIn: !!token,
      userId: token ? getUserId() : null,
      role,
      isAdmin: role === "Admin",
      login,
      logout,
    };
  }, [token, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
