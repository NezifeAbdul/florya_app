import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "aos/dist/aos.css";
import heroImg1 from "../../assets/images/hero2.jpg";
import heroImg2 from "../../assets/images/hero1.jpg";

const SLIDES = [
  { img: heroImg1, key: "bridal", to: "/product?category=adult" },
  { img: heroImg2, key: "kids", to: "/product?category=kid" },
];

const HeroComponent = () => {
  const { t } = useTranslation();
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);

  // parallax: scroll zamanı şəkli yavaş sürüşdürür
  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        imgRefs.current.forEach((img) => {
          if (img) img.style.transform = `translateY(${y * 0.35}px)`;
        });
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="hero-wrapper">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        speed={1200}
        className="hero-swiper"
      >
        {SLIDES.map((slide, index) => (
          <SwiperSlide key={slide.key}>
            <div className="hero-inside">
              <div className="hero-image-wrapper">
                <div className="hero-overlay" />
                <img
                  src={slide.img}
                  alt={t(`hero.${slide.key}.title`)}
                  className="hero-img"
                  ref={(el) => { imgRefs.current[index] = el; }}
                />
              </div>

              <div className="hero-content-wrapper">
                <span className="hero-title" data-aos="fade-up" data-aos-delay="200">
                  {t(`hero.${slide.key}.title`)}
                </span>
                <p data-aos="fade-up" data-aos-delay="400">{t(`hero.${slide.key}.subtitle`)}</p>
                <Link to={slide.to} className="hero-btn" data-aos="fade-up" data-aos-delay="600">
                  {t(`hero.${slide.key}.cta`)}
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroComponent;