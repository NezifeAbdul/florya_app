import { useTranslation } from "react-i18next";
import contactHeroImg from "../../assets/images/home-image2.jpg";
import HeroComponentSecondary from "../ui/HeroComponentSecondary";

const ContactHero = () => {
  const { t } = useTranslation();

  return (
    <HeroComponentSecondary
      backgroundImage={contactHeroImg}
      eyebrow={t("contact.heroEyebrow")}
      title={t("contact.heroTitle")}
      subtitle={t("contact.heroSubtitle")}
    //   parallaxSpeed={0.45}
      height="92vh"
      showScrollHint
    />
  );
};

export default ContactHero;