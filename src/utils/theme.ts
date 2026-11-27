import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const KEY = "theme";
const EVENT = "theme-change";

const readStored = (): Theme => {
  try {
    return localStorage.getItem(KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
};

// cari tema: əvvəl DOM-dan, yoxdursa yadda saxlanmışdan
export const getTheme = (): Theme => {
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "dark" || attr === "light" ? attr : readStored();
};

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;

  // dəyişmə anında transition-ları söndür: yanıb-sönmə olmasın
  const style = document.createElement("style");
  style.appendChild(
    document.createTextNode("*,*::before,*::after{transition:none!important}")
  );
  document.head.appendChild(style);

  root.setAttribute("data-theme", theme);
  root.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVENT));

  // brauzer yeni rəngləri çəkəndən sonra transition-ları qaytar
  void window.getComputedStyle(style).opacity;
  requestAnimationFrame(() => requestAnimationFrame(() => style.remove()));
};

export const initTheme = () => applyTheme(readStored());

const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
};

export const useTheme = () => useSyncExternalStore(subscribe, getTheme, () => "light" as Theme);