import { useTranslation } from "react-i18next";
import shipping from "../../assets/images/products/shipping.png";
import returns from "../../assets/images/products/return.png";
import quality from "../../assets/images/products/quantity.png";

const SERVICES = [
  { id: 1, img: shipping, key: "shipping" },
  { id: 2, img: returns, key: "returns" },
  { id: 3, img: quality, key: "quality" },
] as const;

const ServicesStrip = () => {
  const { t } = useTranslation();

  return (
    <div className="product-services">
      {SERVICES.map((item) => (
        <div className="service-item" key={item.id}>
          <div className="service-inner">
            <img src={item.img} alt="" />
            <h3>{t(`product.services.${item.key}.title`)}</h3>
            <p>{t(`product.services.${item.key}.desc`)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServicesStrip;
