import { useState, useEffect } from "react";
import { FiHeart, FiEye, FiShoppingBag, FiChevronDown } from "react-icons/fi";
import { FaHeart, FaStar, FaRegStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import type { Product } from "../../types/product.types";
import { useWishlist } from "../../utils/wishlistStore";
import { useRequireAuth } from "../../utils/useRequireAuth";
import { useAppDispatch } from "../../utils/useAppDispatch";
import { useLocalized } from "../../utils/useLocalized";
import { addToBasketThunk } from "../../store/basketSlice";

const EMPTY: string[] = [];

interface ProductCardProps {
  product: Product & { sizes?: string[]; colors?: string[] };
  activeFilters?: string[];
}

const ProductCard = ({ product, activeFilters = EMPTY }: ProductCardProps) => {
  const { t } = useTranslation();
  const pick = useLocalized();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const requireAuth = useRequireAuth();
  const { has, toggle } = useWishlist();

  const {
    primaryImage,
    hoverImage,
    categoryTitleAz,
    categoryTitleEn,
    titleAz,
    titleEn,
    price,
    discountPrice,
    averageRating = 0,
    reviewCount = 0,
    sizes = EMPTY,
    colors = EMPTY,
  } = product;

  const title = pick(titleAz, titleEn);

  const hasDiscount     = discountPrice != null && discountPrice < price;
  const discountPercent = hasDiscount
    ? Math.round(((price - discountPrice!) / price) * 100)
    : 0;

  const pickSize = () =>
    (activeFilters.length > 0 ? sizes.find((s) => activeFilters.includes(s)) : undefined) ?? sizes[0] ?? "";

  const [selectedSize, setSelectedSize] = useState<string>(pickSize);
  const [sizeOpen, setSizeOpen]         = useState(false);

  const filtersKey = activeFilters.join("|");
  const sizesKey = sizes.join("|");

  useEffect(() => {
    setSelectedSize(pickSize());
    setSizeOpen(false);

  }, [filtersKey, sizesKey]);

  const wished = has(product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireAuth("auth.wishlistRequired")) return;
    const added = toggle({
      id: product.id,
      slug: product.slug,
      titleEn,
      price,
      discountPrice,
      image: primaryImage,
      stock: product.stock,
    });
    toast.success(added ? t("card.wishlistAdded") : t("card.wishlistRemoved"), {
      toastId: `wl-${product.id}-${added}`,
    });
  };

  const handleAddToCart = () => {
    if (!requireAuth("auth.cartRequired")) return;
    if (product.stock <= 0) {
      toast.error(t("pd.outOfStock"));
      return;
    }
    dispatch(addToBasketThunk({
      productId: product.id,
      quantity: 1,
      selectedSize,
      selectedColor: colors[0] ?? "",
    }));
  };

  return (
    <div className="product-card-wrapper">
      <div className="prc-img-wrapper">
        {hasDiscount && <span className="prc-badge">-{discountPercent}%</span>}
        <img className="prImg1" src={primaryImage} alt={title} />
        <img className="prImg2" src={hoverImage ?? primaryImage} alt={title} />

        <div className="prc-overlay">
          <button type="button" className="prc-cart-btn" onClick={handleAddToCart}>
            <FiShoppingBag size={13} />
            {t("card.addToCart")}
          </button>
          <div className="prc-icon-group">
            <button
              type="button"
              className={`prc-icon-btn ${wished ? "wished" : ""}`}
              aria-label="Wishlist"
              onClick={handleWishlist}
            >
              {wished ? <FaHeart size={14} /> : <FiHeart size={15} />}
            </button>
            <button
              type="button"
              className="prc-icon-btn"
              aria-label={t("card.quickView")}
              onClick={() => navigate(`/products/${product.slug}`)}
            >
              <FiEye size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className="prc-info-wrapper">
        <span className="prc-brand">{pick(categoryTitleAz, categoryTitleEn)}</span>
        <p className="prc-title">{title}</p>

        {reviewCount > 0 && (
          <div className="prc-rating" aria-label={`${averageRating.toFixed(1)} / 5`}>
            {Array.from({ length: 5 }).map((_, i) =>
              i < Math.round(averageRating) ? <FaStar key={i} /> : <FaRegStar key={i} />
            )}
            <small>({reviewCount})</small>
          </div>
        )}

        <div className="prc-prices">
          {hasDiscount ? (
            <>
              <span className="prc-discount">${discountPrice}</span>
              <span className="prc-original">${price}</span>
            </>
          ) : (
            <span className="prc-price-only">${price}</span>
          )}
        </div>

        {sizes.length > 0 && (
          <div className="prc-size-selector">
            <button type="button" className={`prc-size-dropdown ${sizeOpen ? "open" : ""}`} onClick={() => setSizeOpen((v) => !v)}>
              <span>{selectedSize || t("card.size")}</span>
              <FiChevronDown />
            </button>

            {sizeOpen && (
              <div className="prc-size-options">
                {sizes.map((s) => (
                  <div
                    key={s}
                    className={`prc-size-option ${selectedSize === s ? "active" : ""}`}
                    onClick={() => { setSelectedSize(s); setSizeOpen(false); }}
                  >
                    {s}
                    {activeFilters.includes(s) && <span className="prc-size-filtered-dot" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;