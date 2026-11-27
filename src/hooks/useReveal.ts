import { useEffect, useRef } from "react";

// elementlər görünəndə visible class qoyur
export const useReveal = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.15 }
    );

    const targets = root.matches(".fade-in, .slide-up, .info-card")
      ? [root]
      : Array.from(root.querySelectorAll(".fade-in, .slide-up, .info-card"));
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return ref;
};