import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";
import SectionTitle from "../ui/SectionTitle";
import leaf from "../../assets/images/leaf.webp";
import { useLatestReviews } from "../../hooks/useReviews";

const initials = (name: string) =>
  name.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?";

const ReviewCarousel = () => {
  const { t, i18n } = useTranslation();
  const { data = [] } = useLatestReviews(10);
  const reviews = (Array.isArray(data) ? data : []).filter((r) => r.comment?.trim());

  if (reviews.length === 0) return null;

  const locale = i18n.language.startsWith("az") ? "az-AZ" : "en-GB";
  const canLoop = reviews.length > 3;

  return (
    <section className="rvc">
      <div className="container">
        <SectionTitle title={t("reviews.homeTitle")} subtitle={t("reviews.homeSubtitle")} img={leaf} />
      </div>

      <Swiper
        className="rvc__swiper"
        modules={[Autoplay, Pagination]}
        centeredSlides
        loop={canLoop}
        rewind={!canLoop}
        grabCursor
        speed={600}
        spaceBetween={20}
        slidesPerView={1.25}
        autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 1.9, spaceBetween: 20 },
          992: { slidesPerView: 2.9, spaceBetween: 22 },
          1280: { slidesPerView: 3.6, spaceBetween: 24 },
        }}
      >
        {reviews.map((r) => (
          <SwiperSlide key={r.id}>
            <article className="rvc__card">
              <span className="rvc__badge"><FaQuoteLeft /></span>

              <div className="rvc__stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} className={i < r.rating ? "on" : ""} />
                ))}
              </div>

              <p className="rvc__text">{r.comment}</p>

              <footer className="rvc__author">
                <span className="rvc__avatar">{initials(r.userFullName)}</span>
                <div>
                  <strong>{r.userFullName}</strong>
                  <small>
                    {new Date(r.createdAt).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })}
                  </small>
                </div>
              </footer>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default ReviewCarousel;
