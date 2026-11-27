import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";

const RADIUS = 21;
const CIRC = 2 * Math.PI * RADIUS;

const ScrollTopButton = () => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setVisible(y > 300);
        setProgress(max > 0 ? Math.min(1, y / max) : 0);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <button
      type="button"
      className={`stt ${visible ? "is-visible" : ""}`}
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <svg className="stt__ring" viewBox="0 0 48 48" aria-hidden="true">
        <circle className="stt__track" cx="24" cy="24" r={RADIUS} />
        <circle
          className="stt__bar"
          cx="24"
          cy="24"
          r={RADIUS}
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * (1 - progress)}
        />
      </svg>
      <FiArrowUp className="stt__icon" />
    </button>
  );
};

export default ScrollTopButton;