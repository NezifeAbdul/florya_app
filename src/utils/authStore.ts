import { tokenStorage } from "./tokenStorage";
import { useAuth } from "./useAuth";

export const useToken = () => useAuth().token;

export const logout = () => tokenStorage.clear();
