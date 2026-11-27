
import wwd1 from "../../assets/images/wwd1.jpg";
import wwd2 from "../../assets/images/wwd2.jpg";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination, Navigation, Autoplay } from "swiper/modules";
import BaseSwiper from "../ui/BaseSwiper";

interface WwdType {
  img: string;
  title: string;
}

const wwdImages: WwdType[] = [
  { img: wwd1, title: "wwd1" },
  { img: wwd2, title: "wwd2" },
];

export default function WhatWeDoComponent() {
  return (
  <BaseSwiper
    modules={[Pagination, Navigation, Autoplay]}
    options={{
      slidesPerView: 1, loop: true,
      autoplay: { delay: 4000, disableOnInteraction: false },
      pagination: { clickable: true },
      navigation: true,
    }}
    slides={wwdImages.map((item) => <img src={item.img} alt={item.title} />)}
    className="mySwiper"
  />
  );
}