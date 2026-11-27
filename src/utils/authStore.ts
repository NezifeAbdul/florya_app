import { useSyncExternalStore } from "react";
import { getToken } from "./auth";

const EVENT = "auth-change";

export const notifyAuthChange = () => window.dispatchEvent(new Event(EVENT));

const subscribe = (callback: () => void) => {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback); // başqa tabda login/logout
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
};

export const useToken = () => useSyncExternalStore(subscribe, getToken);

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  notifyAuthChange();
};