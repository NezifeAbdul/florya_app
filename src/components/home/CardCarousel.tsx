import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Mousewheel, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import ProductCard from "../commoncomp/ProductCard";
import { useFeaturedProducts } from "../../hooks/useProducts";
import { ProductCardSkeletonList } from "../commoncomp/ProductCardSkeleton";

const CardCarousel = () => {
  const { data: products, isLoading, error } = useFeaturedProducts();
  


  if (isLoading) return <ProductCardSkeletonList count={4} className="recommended__grid" />;
  if (error || !products?.length) return null;

  return (
    <div className="carousel-wrapper">
      <Swiper
        grabCursor
        centeredSlides
        speed={600}
        effect="coverflow"
        loop
        mousewheel={{ forceToAxis: true }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 120,
          modifier: 1,
          slideShadows: true,
        }}
        breakpoints={{
          0:    { slidesPerView: 2 },
          480:  { slidesPerView: 3 },
          768:  { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
        }}
        modules={[EffectCoverflow, Pagination, Mousewheel, Autoplay]}
        className="featured-swiper"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CardCarousel;