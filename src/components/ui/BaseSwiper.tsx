import { Swiper, SwiperSlide } from "swiper/react";
import type { SwiperOptions }  from "swiper/types";
import type { SwiperModule }   from "swiper/types";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/effect-coverflow";

interface BaseSwiperProps {
 
  modules:      SwiperModule[];
  options?:     SwiperOptions;

 
  slides:       React.ReactNode[];

  
  className?:   string;
  wrapperClass?: string;
}


const BaseSwiper = ({
  modules,
  options = {},
  slides,
  className = "",
  wrapperClass = "",
}: BaseSwiperProps) => {
  return (
    <div className={wrapperClass}>
      <Swiper
        modules={modules}
        className={className}
        {...options}
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>{slide}</SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BaseSwiper;