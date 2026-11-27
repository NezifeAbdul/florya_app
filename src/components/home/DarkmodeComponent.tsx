import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { applyTheme, useTheme } from "../../utils/theme";

const DarkModeComponent = () => {
  const dark = useTheme() === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Toggle dark mode"
      className={`toggle-track ${dark ? "is-dark" : ""}`}
      onClick={() => applyTheme(dark ? "light" : "dark")}
    >
      <IoSunnyOutline className="toggle-ico toggle-ico--sun" />
      <IoMoonOutline className="toggle-ico toggle-ico--moon" />
      <span className="toggle-thumb">{dark ? <IoMoonOutline /> : <IoSunnyOutline />}</span>
    </button>
  );
};

export default DarkModeComponent;