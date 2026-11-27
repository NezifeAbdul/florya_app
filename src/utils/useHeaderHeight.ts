import { useEffect } from "react";

export const useHeaderHeight = () => {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(".site-header");
    if (!el) return;

    const root = document.documentElement;

    const apply = () => {
      if (window.scrollY > 0 || el.classList.contains("scrolled")) return;
      root.style.setProperty("--header-h", `${el.offsetHeight}px`);
    };

    apply();

    const observer = new ResizeObserver(apply);
    observer.observe(el);
    window.addEventListener("resize", apply);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, []);
};
