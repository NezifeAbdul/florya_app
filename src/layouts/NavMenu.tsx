import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { MdKeyboardArrowDown } from "react-icons/md";
import { LuArrowUpRight } from "react-icons/lu";
import type { MenuItem } from "../data/navigation";
import { isNavActive } from "../utils/navActive";


interface Props {
  items: MenuItem[];
  variant: "header" | "mobile" | "footer";
  onNavigate?: () => void;
  resetKey?: boolean;
}

const NavMenu = ({ items, variant, onNavigate, resetKey }: Props) => {
  const { t } = useTranslation();
  const { pathname, search } = useLocation();
  const [hovered, setHovered] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!resetKey) setExpanded(null);
  }, [resetKey]);

  const active = (to: string) => isNavActive(to, pathname, search);

  if (variant === "footer") {
    return (
      <ul className="ft-link-list">
        {items.map((item) => (
          <li key={item.key}>
            <Link to={item.to} className="ft-link">
              <span className="ft-link-arrow"><LuArrowUpRight /></span>
              {item.label ?? t(`nav.${item.key}`)}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  if (variant === "mobile") {
    return (
      <>
        {items.map((item) =>
          item.submenu ? (
            <div key={item.key} className="mm__group">
              <button
                type="button"
                className={`mm__link ${expanded === item.key ? "is-active" : ""}`}
                aria-expanded={expanded === item.key}
                onClick={() => setExpanded(expanded === item.key ? null : item.key)}
              >
                {t(`nav.${item.key}`)}
                <MdKeyboardArrowDown className="mm__arrow" />
              </button>

              <div className={`mm__sub ${expanded === item.key ? "is-open" : ""}`}>
                <div className="mm__sub-inner">
                  {item.submenu.map((sub) => (
                    <NavLink key={sub.key} to={sub.to} className="mm__sublink" onClick={onNavigate}>
                      {sub.icon}
                      {sub.label ?? t(`nav.${sub.key}`)}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <NavLink
              key={item.key}
              to={item.to}
              className={() => `mm__link${active(item.to) ? " active" : ""}`}
              onClick={onNavigate}
            >
              {t(`nav.${item.key}`)}
            </NavLink>
          )
        )}
      </>
    );
  }

  const open = (key: string, hasSub: boolean) => {
    if (timer.current) clearTimeout(timer.current);
    if (hasSub) setHovered(key);
  };
  const close = () => {
    timer.current = setTimeout(() => setHovered(null), 120);
  };
  const keep = () => {
    if (timer.current) clearTimeout(timer.current);
  };

  return (
    <ul>
      {items.map((item) => (
        <li
          key={item.key}
          className="main-nav__item"
          onMouseEnter={() => open(item.key, !!item.submenu)}
          onMouseLeave={close}
        >
          <NavLink to={item.to} className={() => `main-nav-link${active(item.to) ? " active" : ""}`}>
            {t(`nav.${item.key}`)}
            {item.submenu && (
              <span className={`nav-arrow ${hovered === item.key ? "rotated" : ""}`}>
                <MdKeyboardArrowDown />
              </span>
            )}
          </NavLink>

          {item.submenu && (
            <div
              className={`submenu ${hovered === item.key ? "submenu--open" : ""}`}
              onMouseEnter={keep}
              onMouseLeave={close}
            >
              <div className="submenu__inner">
                {item.submenu.map((sub) => (
                  <NavLink key={sub.key} className="submenu__link" to={sub.to}>
                    {sub.icon && <span className="sub-icon">{sub.icon}</span>}
                    <span className="sub-label">{sub.label ?? t(`nav.${sub.key}`)}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default NavMenu;