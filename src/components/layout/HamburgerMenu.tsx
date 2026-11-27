import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { MdKeyboardArrowDown } from "react-icons/md";
import { RiCloseLine } from "react-icons/ri";
import { FiLogIn, FiLogOut, FiSettings, FiMoon, FiSun } from "react-icons/fi";
import floralLogo from "../../assets/images/header/florya_logo.png";
import { applyTheme, useTheme } from "../../utils/theme";
import type { MenuItem } from "../../data/navigation";
import NavMenu from "../../layouts/NavMenu";


interface Props {
  open: boolean;
  items: MenuItem[];
  loggedIn: boolean;
  fullName: string;
  initials: string;
  wishlistCount: number;
  onClose: () => void;
  onLogout: () => void;
}

const HamburgerMenu = ({ open, items, loggedIn, fullName, initials, wishlistCount, onClose, onLogout }: Props) => {
  const { t, i18n } = useTranslation();
  const dark = useTheme() === "dark";
  const lang = i18n.language.startsWith("az") ? "az" : "en";
  const [settings, setSettings] = useState(false);

  useEffect(() => {
    if (!open) setSettings(false);
  }, [open]);

  const changeLang = (l: string) => {
    i18n.changeLanguage(l);
    document.documentElement.lang = l;
  };

  return (
    <>
      <div className={`mm-overlay ${open ? "is-open" : ""}`} onClick={onClose} />

      <aside className={`mm ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="mm__top">
          <img src={floralLogo} alt="Florya" className="mm__logo" />
          <button type="button" className="mm__close" onClick={onClose} aria-label="Close">
            <RiCloseLine />
          </button>
        </div>

        <nav className="mm__nav">
          <NavMenu variant="mobile" items={items} onNavigate={onClose} resetKey={open} />

          <NavLink to="/wishlist" className="mm__link" onClick={onClose}>
            {t("nav.wishlist")}
            {wishlistCount > 0 && <span className="mm__count">{wishlistCount}</span>}
          </NavLink>
        </nav>

        <div className="mm__foot">
          <div className={`mm__panel ${settings ? "is-open" : ""}`}>
            <div className="mm__panel-inner">
              {loggedIn ? (
                <>
                  <div className="mm__user">
                    <span className="mm__avatar">{initials}</span>
                    <span className="mm__name">{fullName}</span>
                  </div>
                  <button type="button" className="mm__row" onClick={onLogout}>
                    <FiLogOut /> {t("topbar.logout")}
                  </button>
                </>
              ) : (
                <NavLink to="/login" className="mm__row" onClick={onClose}>
                  <FiLogIn /> {t("topbar.login")}
                </NavLink>
              )}

              <button type="button" className="mm__row" onClick={() => applyTheme(dark ? "light" : "dark")}>
                {dark ? <FiSun /> : <FiMoon />} {dark ? t("menu.light") : t("menu.dark")}
              </button>

              <div className="mm__langs">
                {(["en", "az"] as const).map((l) => (
                  <button key={l} type="button" className={lang === l ? "is-on" : ""} onClick={() => changeLang(l)}>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            className={`mm__settings ${settings ? "is-on" : ""}`}
            aria-expanded={settings}
            onClick={() => setSettings((v) => !v)}
          >
            {loggedIn ? <span className="mm__avatar mm__avatar--sm">{initials}</span> : <FiSettings />}
            <span>{t("menu.settings")}</span>
            <MdKeyboardArrowDown className="mm__arrow" />
          </button>
        </div>
      </aside>
    </>
  );
};

export default HamburgerMenu;