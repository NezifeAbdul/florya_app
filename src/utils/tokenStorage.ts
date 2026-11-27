export const AUTH_EVENT = "auth-change";

const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";
const USER_KEY = "auth_user";

export const notifyAuthChange = () => window.dispatchEvent(new Event(AUTH_EVENT));

const read = (key: string) => localStorage.getItem(key) ?? sessionStorage.getItem(key);

export const tokenStorage = {
  getAccess: () => read(ACCESS_KEY),
  getRefresh: () => read(REFRESH_KEY),

  setTokens: (access: string, refresh?: string, remember = true) => {
    const target = remember ? localStorage : sessionStorage;
    const other = remember ? sessionStorage : localStorage;

    other.removeItem(ACCESS_KEY);
    other.removeItem(REFRESH_KEY);

    target.setItem(ACCESS_KEY, access);
    if (refresh) target.setItem(REFRESH_KEY, refresh);
    notifyAuthChange();
  },

  clear: () => {
    [localStorage, sessionStorage].forEach((s) => {
      s.removeItem(ACCESS_KEY);
      s.removeItem(REFRESH_KEY);
      s.removeItem(USER_KEY);
    });
    notifyAuthChange();
  },
};
