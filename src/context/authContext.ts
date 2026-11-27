import { createContext } from "react";

export interface AuthContextValue {
  token: string | null;
  isLoggedIn: boolean;
  userId: string | null;
  role: string | null;
  isAdmin: boolean;
  login: (accessToken: string, refreshToken?: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
