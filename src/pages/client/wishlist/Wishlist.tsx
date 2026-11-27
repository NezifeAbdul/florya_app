import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { FiX, FiHeart } from "react-icons/fi";
import { useWishlist } from "../../../utils/wishlistStore";
import { useToken } from "../../../auth/authStore";

const Wishlist = () => {
  const { t } = useTranslation();
  const { items, remove } = useWishlist();
  const loggedIn = !!useToken();

  if (!loggedIn) {
    return (
      <div className="container wishlist-page">
        <div className="wishlist-empty">
          <FiHeart className="wishlist-empty__icon" />
          <h2>{t("nav.wishlist")}</h2>
          <p>{t("wishlist.loginPrompt")}</p>
          <Link to="/login" className="wishlist-btn-link">{t("wishlist.login")}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container wishlist-page">
      <div className="wishlist-head">
        <h2>{t("wishlist.title")}</h2>
        <span>{items.length} {t("wishlist.item", { count: items.length })}</span>
      </div>

      {items.length === 0 ? (
        <div className="wishlist-empty">
          <FiHeart className="wishlist-empty__icon" />
          <p>{t("wishlist.empty")}</p>
          <Link to="/product" className="wishlist-btn-link">{t("wishlist.browse")}</Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {items.map((item) => {
            const hasDiscount = item.discountPrice != null && item.discountPrice < item.price;
            const discountPercent = hasDiscount
              ? Math.round(((item.price - item.discountPrice!) / item.price) * 100)
              : 0;

            return (
              <div className="wishlist-card" key={item.id}>
                <button
                  className="wishlist-card__remove"
                  onClick={() => remove(item.id)}
                  aria-label="Remove from wishlist"
                >
                  <FiX size={14} />
                </button>

                {hasDiscount && <span className="wishlist-card__badge">-{discountPercent}%</span>}

                <Link to={`/products/${item.slug}`} className="wishlist-card__img">
                  <img src={item.image} alt={item.titleEn} />
                  {item.stock <= 0 && (
                    <span className="wishlist-card__soldout">{t("wishlist.outOfStock")}</span>
                  )}
                </Link>

                <div className="wishlist-card__info">
                  <Link to={`/products/${item.slug}`} className="wishlist-card__title">
                    {item.titleEn}
                  </Link>
                  <div className="wishlist-card__price">
                    {hasDiscount ? (
                      <>
                        <span className="now">${item.discountPrice}</span>
                        <span className="old">${item.price}</span>
                      </>
                    ) : (
                      <span className="now">${item.price}</span>
                    )}
                  </div>
                  <Link to={`/products/${item.slug}`} className="wishlist-card__view">
                    {t("wishlist.view")}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;