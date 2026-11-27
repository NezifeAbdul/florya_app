import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { FiArrowRight } from "react-icons/fi";
import { PiShoppingBagOpenLight} from "react-icons/pi";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { toggleBasket } from "../../store/basketSlice";

const EmptyBasket = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  return (
    <div className="eb">
      <div className="eb__art" aria-hidden="true">
        <span className="eb__glow" />
        <span className="eb__plate" />
        <PiShoppingBagOpenLight className="eb__bag" />

      </div>

      <h3 className="eb__title">{t("basket.emptyTitle")}</h3>
      <p className="eb__text">{t("basket.emptyText")}</p>

      <NavLink to="/product" className="eb__btn" onClick={() => dispatch(toggleBasket())}>
        {t("basket.browse")} <FiArrowRight />
      </NavLink>
    </div>
  );
};

export default EmptyBasket;