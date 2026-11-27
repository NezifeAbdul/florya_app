import { LuPhoneCall, LuUserRound } from "react-icons/lu";
import { GrLocation } from "react-icons/gr";
import { CiClock2 } from "react-icons/ci";
import { useState, useEffect } from "react";
import { BsBasket3 } from "react-icons/bs";
import { GoHeart } from "react-icons/go";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import { NavLink, useLocation, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import floralLogo from "../assets/images/header/florya_logo.png";
import flower1 from "../assets/images/flower-icon1.jpg";
import flower2 from "../assets/images/flower-icon2.jpg";
import diamond from "../assets/images/diamond-gold.png";

import DarkModeComponent from "../components/home/DarkmodeComponent";
import HamburgerMenu from "../components/layout/HamburgerMenu";

import ConfirmModal from "../components/commoncomp/ConfirmModal";
import SearchBar from "../components/home/SearchBar";
import LanguageSwitcher from "../components/commoncomp/LanguageSwitcher";

import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import { fetchBasketThunk, resetBasket, toggleBasket } from "../store/basketSlice";
import { useWishlist } from "../utils/wishlistStore";
import { useToken } from "../auth/authStore";
import { logout } from "../services/api/authService";
import { useHeaderHeight } from "../hooks/useHeaderHeight";
import { useCurrentUser } from "../auth/useCurrentUser";
import { useTheme } from "../utils/theme";
import { useNavItems } from "../hooks/useNavItems";
import NavMenu from "./NavMenu";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { t } = useTranslation();
  useHeaderHeight();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const totalItemCount = useAppSelector((s) => s.basket.basket?.totalItemCount ?? 0);
  const { items: wishlistItems } = useWishlist();
  const dark = useTheme() === "dark";
  const navItems = useNavItems();

  const loggedIn = !!useToken();

  useEffect(() => {
    if (loggedIn) dispatch(fetchBasketThunk());
  }, [loggedIn, dispatch]);
  const { initials, fullName } = useCurrentUser();

  const deco1 = dark ? diamond : flower1;
  const deco2 = dark ? diamond : flower2;
  const decoClass = dark ? "is-gem" : "";

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;

      if (y <= 40) setScrolled(false);
      else if (delta > 4) setScrolled(true);
      else if (delta < -4) setScrolled(false);

      document.body.classList.toggle("header-scrolled", y > 40);
      lastY = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => e.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, search]);

  const askLogout = () => setConfirmOpen(true);

  const handleLogout = async () => {
    await logout();
    dispatch(resetBasket());
    queryClient.removeQueries({ queryKey: ["me"] });
    setMenuOpen(false);
    setConfirmOpen(false);
    toast.success(t("auth.loggedOut"));
    navigate("/");
  };

  return (
    <>
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <div className="top-bar d-none d-md-block">
          <div className="container-fluid px-md-5">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-4 top-bar-left">
                <div className="d-flex align-items-center gap-2">
                  <CiClock2 className="top-bar-icon" />
                  <span className="top-bar-text">{t("topbar.hours")}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <GrLocation className="top-bar-icon" />
                  <span className="top-bar-text">{t("topbar.location")}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <LuPhoneCall className="top-bar-icon" />
                  <a href="tel:+994555666666" className="top-bar-text">(+994) 55 566 66 66</a>
                </div>
              </div>

              <div className="top-bar-right d-flex align-items-center gap-3">
                {loggedIn ? (
                  <div className="d-flex align-items-center gap-3">
                    <span className="user-avatar" title={fullName}>{initials}</span>
                    <button type="button" className="top-bar-text logout-btn" onClick={askLogout}>
                      <FiLogOut /> {t("topbar.logout")}
                    </button>
                  </div>
                ) : (
                  <div className="d-flex align-items-center gap-1">
                    <LuUserRound className="top-bar-icon" />
                    <NavLink to="/login" className="top-bar-text">{t("topbar.login")}</NavLink>
                  </div>
                )}
                <LanguageSwitcher />
                <DarkModeComponent />
              </div>
            </div>
          </div>
        </div>

        <div className="header-blur-wrap">
          <nav className="top-nav">
            <ul>
              <li className="top-nav__left order-2 order-md-1">
                <div className="flower-deco d-none d-md-flex">
                  <img className={decoClass} src={deco2} alt="" />
                  <img className={decoClass} src={deco1} alt="" />
                </div>
                <div className="d-none d-md-flex">
                  <SearchBar />
                </div>
              </li>

              <li className="order-first order-md-2">
                <div className="logo-wrap">
                  <NavLink to="/"><img src={floralLogo} alt="Florya" /></NavLink>
                </div>
              </li>

              <li className="top-nav__right d-flex align-items-center order-3">
                <div className="top-nav-icons">
                  <NavLink to="/wishlist">
                    <p>{t("nav.wishlist").toLowerCase()}</p>
                    <span><GoHeart /></span>
                    {wishlistItems.length > 0 && <span className="cart-badge">{wishlistItems.length}</span>}
                  </NavLink>

                  <button type="button" className="basket-trigger" aria-label="Basket" onClick={() => dispatch(toggleBasket())}>
                    <span><BsBasket3 /></span>
                    {totalItemCount > 0 && <span className="cart-badge">{totalItemCount}</span>}
                  </button>
                </div>

                <div className="flower-deco d-none d-md-flex">
                  <img className={decoClass} src={deco1} alt="" />
                  <img className={decoClass} src={deco2} alt="" />
                </div>

                <div className="d-flex d-md-none">
                  <SearchBar mobile />
                </div>

                <button
                  type="button"
                  className="hamburger d-flex d-md-none"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-label="Toggle menu"
                  aria-expanded={menuOpen}
                >
                  {menuOpen ? <RiCloseLine /> : <RiMenu3Line />}
                </button>
              </li>
            </ul>
          </nav>

          <nav className="main-nav d-none d-md-flex justify-content-center align-items-center">
            <NavMenu variant="header" items={navItems} />
          </nav>
        </div>
      </header>

      <HamburgerMenu
        open={menuOpen}
        items={navItems}
        loggedIn={loggedIn}
        fullName={fullName}
        initials={initials}
        wishlistCount={wishlistItems.length}
        onClose={() => setMenuOpen(false)}
        onLogout={askLogout}
      />

      <ConfirmModal
        open={confirmOpen}
        icon={<FiLogOut />}
        title={t("logout.title")}
        message={t("logout.text")}
        confirmText={t("logout.confirm")}
        onConfirm={handleLogout}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
};

export default Header;