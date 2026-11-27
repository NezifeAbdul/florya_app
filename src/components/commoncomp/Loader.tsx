import { useEffect, useState } from "react";
import logo from "../../assets/images/header/florya_logo.png";

export const Preloader = () => {
  const [hiding, setHiding] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const hide = () => setTimeout(() => setHiding(true), 600);
    if (document.readyState === "complete") hide();
    else window.addEventListener("load", hide, { once: true });

    const remove = setTimeout(() => setGone(true), 1600);
    return () => clearTimeout(remove);
  }, []);

  if (gone) return null;

  return (
    <div className={`app-preloader ${hiding ? "hide" : ""}`}>
      <img src={logo} alt="Florya" />
      <span className="app-preloader__bar" />
    </div>
  );
};

export const PageLoader = ({ height = "50vh" }: { height?: string }) => (
  <div className="page-loader" style={{ minHeight: height }}>
    <img src={logo} alt="" />
    <span className="app-preloader__bar" />
  </div>
);


export const ProductGridSkeleton = ({ count = 6, className = "product-grid cols-3" }: { count?: number; className?: string }) => (
  <div className={className}>
    {Array.from({ length: count }).map((_, i) => (
      <div className="skeleton-card" key={i}>
        <div className="skeleton skeleton-card__img" />
        <div className="skeleton skeleton-card__line" />
        <div className="skeleton skeleton-card__line short" />
      </div>
    ))}
  </div>
);