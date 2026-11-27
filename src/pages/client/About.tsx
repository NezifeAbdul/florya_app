import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { CountUp } from "countup.js";
import useParallax from "../../utils/useParallax";
import about_img1 from "../../assets/images/Aboutmages/about_img1.jpg";
import about_img2 from "../../assets/images/Aboutmages/about_img2.jpg";
import about_img3 from "../../assets/images/Aboutmages/about_img4.jpg";
import about_img5 from "../../assets/images/Aboutmages/about_img5.jpg";
import about_hero from "../../assets/images/Aboutmages/about_hero.jpg";
import leaf from "../../assets/images/leaf.webp";
import SectionTitle from "../../components/ui/SectionTitle";
import HeroComponentSecondary from "../../components/ui/HeroComponentSecondary";
import ReviewCarousel from "../../components/commoncomp/ReviewComponent";
import BrandsComponent from "../../components/commoncomp/BrandsComponent";
import ServicesStrip from "../../components/commoncomp/ServicesStrip";

const STATS = [
  { id: "stat1", end: 120, key: "stat1" },
  { id: "stat2", end: 350, key: "stat2" },
];

const About = () => {
  const { t } = useTranslation();
  useParallax(".parallax-img", 0.12);

  const sectionRef = useRef<HTMLElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          STATS.forEach(({ id, end }) => {
            new CountUp(id, end, { duration: 2.5, prefix: "+" }).start();
          });
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="about_container">
      <section className="about_hero">
        <HeroComponentSecondary
          backgroundImage={about_hero}
          eyebrow={t("about.heroEyebrow")}
          title={t("about.heroTitle")}
          subtitle={t("about.heroSubtitle")}
          parallaxSpeed={0.45}
          height="84vh"
          showScrollHint
        />
      </section>

      <section className="about_attention_section container">
        <SectionTitle
          subtitle={t("about.whoSub")}
          title={t("about.whoTitle")}
          img={leaf}
          className="about_attention_section__title"
        />

        <div className="about_attention_columns">
          <div className="about_attention_left">
            <div className="attention" data-aos="fade-right" data-aos-delay="100">
              <div className="parallax-wrap">
                <img src={about_img1} alt={t("about.bridalTitle")} className="parallax-img" />
              </div>
              <div className="attention_text">
                <h4>{t("about.bridalTitle")}</h4>
                <p>{t("about.bridalText")}</p>
                <Link to="/product?category=adult" className="btn btn-outline">
                  {t("about.bridalBtn")}
                </Link>
              </div>
            </div>

            <div className="experience" data-aos="fade-up" data-aos-delay="200">
              <div className="parallax-wrap">
                <img src={about_img2} alt={t("about.experience")} className="parallax-img" />
              </div>
              <h4>{t("about.experience")}</h4>
            </div>
          </div>

          <div className="about_attention_right" data-aos="fade-left" data-aos-delay="300">
            <div className="support">
              <div className="parallax-wrap">
                <img src={about_img3} alt={t("about.kidsTitle")} className="parallax-img" />
              </div>
              <div className="support_text">
                <h4>{t("about.kidsTitle")}</h4>
                <p>{t("about.kidsText")}</p>
                <Link to="/product?category=kid" className="btn btn-filled">
                  {t("about.kidsBtn")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about_creative_section" ref={sectionRef}>
        <SectionTitle
          subtitle={t("about.driveSub")}
          title={t("about.driveTitle")}
          img={leaf}
          className="about_creative_section__title"
        />

        <div className="about_creative_inner">
          <div className="about_bg parallax-wrap">
            <img src={about_img5} alt="" className="parallax-img" />
            <div className="about_overlay" />
          </div>

          <div className="about_content" data-aos="fade-right" data-aos-delay="100">
            <span className="about_label">{t("about.tailored")}</span>
            <h2>{t("about.momentTitle")}</h2>
            <p>{t("about.momentText")}</p>
            <Link to="/contact" className="btn btn-outline-white">
              {t("about.momentBtn")}
            </Link>
          </div>

          <div className="about_stats" data-aos="fade-left" data-aos-delay="200">
            {STATS.map(({ id, key }) => (
              <div className="stat_card" key={id}>
                <span id={id} className="stat_number">0</span>
                <h4>{t(`about.${key}Label`)}</h4>
                <p>{t(`about.${key}Desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="partners container-fluid px-0">
        <BrandsComponent />
      </section>

      <ReviewCarousel />
      <ServicesStrip />
    </div>
  );
};

export default About;