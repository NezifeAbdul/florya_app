import { useEffect } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import service1 from "../../assets/images/service1.webp";
import service2 from "../../assets/images/service2.webp";
import service3 from "../../assets/images/service3.webp";
import service4 from "../../assets/images/service4.jpg";
import leaf from "../../assets/images/leaf.webp";
import intro1 from "../../assets/images/intro1.webp";
import intro2 from "../../assets/images/intro2.webp";
import diamond2 from "../../assets/images/diamond-yellow.png";
import diamond1 from "../../assets/images/diamond-pink.png";

import SectionTitle from "../../components/ui/SectionTitle";
import WhatWeDoComponent from "../../components/home/WhatWeDoComponent";
import CardCarousel from "../../components/home/CardCarousel";
import ReviewCarousel from "../../components/commoncomp/ReviewComponent";
import BrandsComponent from "../../components/commoncomp/BrandsComponent";
import HeroComponent from "../../components/commoncomp/HeroComponent";

const STEPS = [
  { img: service1, key: "choose",  num: 1, bg: "#fce8e8" },
  { img: service2, key: "ship",    num: 2, bg: "#fdf3e7" },
  { img: service3, key: "tryOn",   num: 3, bg: "#e8f5ee" },
  { img: service4, key: "wedding", num: 4, bg: "#fce8f3" },
];

const ACCORDION = [1, 2, 3];

const Home = () => {
  const { t } = useTranslation();

  useEffect(() => {
    AOS.init({ duration: 900, once: true, easing: "ease-out-cubic" });
  }, []);

  return (
    <section className="home">
      <HeroComponent />

      <section className="introducing_section container">
        <div className="intro-content row">
          <div className="intro-left col-sm-12 col-md-6 col-lg-6">
            <SectionTitle
              subtitle={t("home.introSub")}
              title={t("home.introTitle")}
              img={leaf}
              className="flex-column align-items-center justify-content-center"
            />
            <div className="intro-left-img-wrapper"><img src={intro1} alt="intro1" /></div>
          </div>

          <div className="intro-right col-sm-12 col-md-6 col-lg-6">
            <div className="intro-right-img-wrapper"><img src={intro2} alt="intro2" /></div>
            <div className="intro-right-text">
              <h3>{t("home.believeTitle")}</h3>
              <p>{t("home.believeText")}</p>
              <Link to="/product">{t("home.shopCollection")}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-products container">
        <SectionTitle
          subtitle={t("home.newArrivals")}
          title={t("home.featured")}
          img={leaf}
          className="flex-column align-items-center justify-content-center mt-5"
        />
        <CardCarousel />
      </section>

      <section className="partners container-fluid px-0">
        <BrandsComponent />
      </section>

      <section className="what-we-do">
        <div className="wwd-content">
          <div className="wwd-left"><WhatWeDoComponent /></div>

          <div className="wwd-right">
            <SectionTitle title={t("home.wwdTitle")} subtitle={t("home.wwdSub")} img={leaf} />
            <p>{t("home.wwdP1")}</p>
            <p>{t("home.wwdP2")}</p>

            <div className="accordion" id="accordionExample">
              {ACCORDION.map((n, i) => (
                <div className="accordion-item" key={n}>
                  <h2 className="accordion-header" id={`heading${n}`}>
                    <button
                      className={`accordion-button ${i === 0 ? "" : "collapsed"}`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${n}`}
                      aria-expanded={i === 0}
                      aria-controls={`collapse${n}`}
                    >
                      {t(`home.acc${n}Title`)}
                    </button>
                  </h2>
                  <div
                    id={`collapse${n}`}
                    className={`accordion-collapse collapse ${i === 0 ? "show" : ""}`}
                    aria-labelledby={`heading${n}`}
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">{t(`home.acc${n}Body`)}</div>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/contact" className="get-started-btn">{t("home.getStarted")}</Link>

            <img
              src={diamond2}
              alt="diamond-brilliant"
              className="wwd-diamond"
              data-aos="zoom-in"
              data-aos-delay="400"
              data-aos-duration="800"
            />
          </div>
        </div>
      </section>

      <section><ReviewCarousel /></section>

      <section className="services-section container-fluid">
        <img src={diamond1} alt="diamond-pink" className="pink-diamond-deco" data-aos="zoom-in" data-aos-delay="200" />

        <SectionTitle subtitle={t("home.hiwSub")} title={t("home.hiwTitle")} img={leaf} />

        <div className="container">
          <div className="steps-row">
            {STEPS.map((step, index) => (
              <div
                className="step-col"
                key={step.key}
                data-aos={index % 2 === 0 ? "fade-up" : "fade-down"}
                data-aos-delay={String(index * 150)}
              >
                <div className="step-card" style={{ backgroundColor: step.bg }}>
                  <div className="step-number">{step.num}</div>
                  <h3 className="step-title">{t(`home.steps.${step.key}`)}</h3>
                  <div className="step-img-wrapper">
                    <img src={step.img} alt={t(`home.steps.${step.key}`)} className="step-img" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
};

export default Home;