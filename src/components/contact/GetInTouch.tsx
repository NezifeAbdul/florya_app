import { useTranslation } from "react-i18next";
import bridepng from "../../assets/images/image-collection.webp";
import ContactForm from "./ContactForm";
import { useReveal } from "../../utils/useReveal";

const GetInTouch = () => {
  const { t } = useTranslation();
  const ref = useReveal<HTMLElement>();

  return (
    <section className="get-in-touch" ref={ref}>
      <div className="git-image-col slide-up">
        <img src={bridepng} alt="bride" className="bride-img" />
        <div className="git-image-overlay" />
        <div className="git-image-text">
          <span>{t("contact.quote1")}</span>
          <span>{t("contact.quote2")}</span>
        </div>
      </div>

      <div className="git-form-col slide-up" style={{ animationDelay: "0.2s" }}>
        <span className="form-eyebrow">{t("contact.formEyebrow")}</span>
        <h2>{t("contact.formTitle")}</h2>
        <p className="form-subtitle">{t("contact.formSubtitle")}</p>
        <ContactForm />
      </div>
    </section>
  );
};

export default GetInTouch;