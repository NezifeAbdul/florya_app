import { useTranslation } from "react-i18next";
import { FiMapPin, FiMail, FiPhone, FiInstagram } from "react-icons/fi";
import { FOOTER_INFO } from "../../data/footerInfo";
import { useReveal } from "../../hooks/useReveal";

const ContactInfoCards = () => {
  const { t } = useTranslation();
  const ref = useReveal<HTMLDivElement>();

  const cards = [
    {
      icon: <FiMapPin />,
      title: t("contact.visit"),
      lines: [t("contact.addressLine1"), t("contact.addressLine2")],
      href: FOOTER_INFO.mapsUrl,
    },
    {
      icon: <FiMail />,
      title: t("contact.emailUs"),
      lines: ["Abdullayeva Nazifa", FOOTER_INFO.email],
      href: `mailto:${FOOTER_INFO.email}`,
    },
    {
      icon: <FiPhone />,
      title: t("contact.callUs"),
      lines: [FOOTER_INFO.phone, t("contact.hours")],
      href: FOOTER_INFO.phoneHref,
    },
    {
      icon: <FiInstagram />,
      title: t("contact.social"),
      lines: ["@florya.weddings", "Instagram / Pinterest"],
      href: FOOTER_INFO.social.instagram,
    },
  ];

  return (
    <section className="contact-info-section">
      <div className="info-cards" ref={ref}>
        {cards.map((c, i) => (
          <a
            key={c.title}
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="info-card fade-in"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <div className="icon-wrapper">{c.icon}</div>
            <h3>{c.title}</h3>
            <p>
              {c.lines[0]}
              <br />
              {c.lines[1]}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
};

export default ContactInfoCards;