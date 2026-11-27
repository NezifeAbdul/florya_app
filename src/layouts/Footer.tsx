import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import floralLogo from "../../src/assets/images/header/florya_logo.png";
import { LuPhoneCall, LuMapPin, LuMail, LuArrowUpRight, LuCopyright, LuHeart } from "react-icons/lu";
import { RiInstagramLine, RiPinterestLine, RiFacebookBoxLine, RiTiktokLine } from "react-icons/ri";
import { useNavItems } from "../utils/useNavItems";
import { sendSubscribe } from "../services/emailService";
import { FOOTER_INFO } from "../data/footerInfo";
import NavMenu from "./NavMenu";

const SOCIALS = [
  { Icon: RiInstagramLine, label: "Instagram", href: FOOTER_INFO.social.instagram },
  { Icon: RiPinterestLine, label: "Pinterest", href: FOOTER_INFO.social.pinterest },
  { Icon: RiFacebookBoxLine, label: "Facebook", href: FOOTER_INFO.social.facebook },
  { Icon: RiTiktokLine, label: "TikTok", href: FOOTER_INFO.social.tiktok },
];

const Footer = () => {
  const { t } = useTranslation();
  const navItems = useNavItems();
  const footerRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const collectionLinks = navItems.find((i) => i.key === "collection")?.submenu ?? [];
  const mainLinks = navItems.filter((i) => i.key !== "dashboard");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("ft-visible")),
      { threshold: 0.12 }
    );
    footerRef.current?.querySelectorAll(".ft-animate").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const subscribe = async (e: FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(value)) return void toast.warning(t("footer.emailInvalid"));

    setSending(true);
    try {
      await sendSubscribe(value);
      toast.success(t("footer.subscribed"));
      setEmail("");
    } catch {
      toast.error(t("footer.subscribeFailed"));
    } finally {
      setSending(false);
    }
  };

  return (
    <footer className="site-footer" ref={footerRef}>
      <div className="ft-marquee-band" aria-hidden="true">
        <div className="ft-marquee-track">
          {Array.from({ length: 12 }).map((_, i) => (
            <img key={i} src={floralLogo} alt="" className="ft-marquee-logo" />
          ))}
        </div>
      </div>

      <div className="ft-body">
        <div className="ft-col ft-brand-col ft-animate">
          <img src={floralLogo} alt="Florya Logo" className="ft-logo" />
          <p className="ft-tagline">{t("footer.tagline")}</p>
          <div className="ft-socials">
            {SOCIALS.map(({ Icon, label, href }) => (
              <a key={label} href={href} className="ft-social-btn" aria-label={label} target="_blank" rel="noopener noreferrer">
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div className="ft-col ft-animate" style={{ animationDelay: "0.1s" }}>
          <h4 className="ft-col-title">{t("footer.navigation")}</h4>
          <NavMenu variant="footer" items={mainLinks} />
        </div>

        <div className="ft-col ft-animate" style={{ animationDelay: "0.2s" }}>
          <h4 className="ft-col-title">{t("footer.collections")}</h4>
          <NavMenu
            variant="footer"
            items={[
              ...collectionLinks.map((s) => ({ key: s.key, to: s.to, label: s.label })),
              { key: "all-collections", to: "/collections", label: t("footer.allCollections") },
            ]}
          />
        </div>

        <div className="ft-col ft-animate" style={{ animationDelay: "0.3s" }}>
          <h4 className="ft-col-title">{t("footer.contact")}</h4>
          <ul className="ft-contact-list">
            <li>
              <LuMapPin className="ft-contact-icon" />
              <a href={FOOTER_INFO.mapsUrl} target="_blank" rel="noopener noreferrer">{FOOTER_INFO.address}</a>
            </li>
            <li>
              <LuPhoneCall className="ft-contact-icon" />
              <a href={FOOTER_INFO.phoneHref}>{FOOTER_INFO.phone}</a>
            </li>
            <li>
              <LuMail className="ft-contact-icon" />
              <a href={`mailto:${FOOTER_INFO.email}`}>{FOOTER_INFO.email}</a>
            </li>
          </ul>

          <div className="ft-newsletter">
            <p>{t("footer.subscribe")}</p>
            <form className="ft-newsletter-form" onSubmit={subscribe} noValidate>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
              />
              <button type="submit" aria-label="Subscribe" disabled={sending}>
                <LuArrowUpRight />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="ft-bottom ft-animate" style={{ animationDelay: "0.4s" }}>
        <p className="ft-copy">
          <LuCopyright /> {new Date().getFullYear()} Florya. {t("footer.rights")}
        </p>
        <div className="ft-bottom-links">
          <Link to="/privacy">{t("footer.privacy")}</Link>
          <LuHeart className="ft-sep" />
          <Link to="/terms">{t("footer.terms")}</Link>
          <LuHeart className="ft-sep" />
          <Link to="/cookies">{t("footer.cookies")}</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;