import { Autoplay } from "swiper/modules";
import BaseSwiper from "../ui/BaseSwiper";
import partner1 from "../../assets/images/partner1.webp";
import partner2 from "../../assets/images/partner2.webp";
import partner3 from "../../assets/images/partner3.webp";
import partner4 from "../../assets/images/partner4.webp";
import partner5 from "../../assets/images/partner5.webp";
import partner6 from "../../assets/images/partner6.webp";
import partner7 from "../../assets/images/partner7.webp";

interface PartnerType {
  img:   string;
  title: string;
}

const brands: PartnerType[] = [
  { img: partner1, title: "ronald"  },
  { img: partner2, title: "allure"  },
  { img: partner3, title: "disney"  },
  { img: partner4, title: "monreal" },
  { img: partner5, title: "essence" },
  { img: partner6, title: "stella"  },
  { img: partner7, title: "martina" },
];

// Infinite loop üçün ikiqat array
const doubledBrands = [...brands, ...brands];

const BrandsComponent = () => {
  const slideNodes = doubledBrands.map((p) => (
    <div className="partner-slide">
      <div className="partner-img-wrap">
        <img src={p.img} alt={p.title} />
      </div>
    </div>
  ));

  return (
    <div className="brands-wrapper">
      <BaseSwiper
        modules={[Autoplay]}
        options={{
          loop:          true,
          speed:         3500,
          allowTouchMove: false,
          autoplay:      { delay: 0, disableOnInteraction: false },
          slidesPerView: 2,
          spaceBetween:  0,
          breakpoints: {
            480:  { slidesPerView: 3 },
            768:  { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          },
        }}
        slides={slideNodes}
        className="brands-swiper"
      />
    </div>
  );
};

export default BrandsComponent;