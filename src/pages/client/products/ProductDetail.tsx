import { useState } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { FiMinus, FiPlus } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useProductBySlug } from "../../../hooks/useProducts";
import { addToBasketThunk } from "../../../store/basketSlice";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import WishlistButton from "../../../components/commoncomp/WishlistButton";
import RecommendedProducts from "../../../components/commoncomp/RecommendedProducts";
import ProductReviews from "../../../components/commoncomp/ProductReviews";
import { useRequireAuth } from "../../../auth/useRequireAuth";
import { useLocalized } from "../../../hooks/useLocalized";
import { PageLoader } from "../../../components/commoncomp/Loader";

const ProductDetail = () => {
  const { t } = useTranslation();
  const pick = useLocalized();
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useProductBySlug(slug ?? "");

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  const dispatch = useAppDispatch();
  const requireAuth = useRequireAuth();

  if (isLoading) return <PageLoader height="70vh" />;

  if (error || !product) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "6rem 0" }}>
        {t("pd.notFound")}
      </div>
    );
  }

  const title = pick(product.titleAz, product.titleEn);
  const images = (product.images ?? []).slice().sort((a, b) => a.displayOrder - b.displayOrder);

  const hasDiscount = product.discountPrice != null && product.discountPrice < product.price;
  const unitPrice = hasDiscount ? product.discountPrice! : product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!requireAuth("auth.cartRequired")) return;

    if (product.sizes.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    dispatch(addToBasketThunk({
      productId: product.id,
      quantity,
      selectedSize,
      selectedColor,
    }));
  };

  return (
    <div className="pd-wrapper">
      <div className="pd-container">
        <div className="pd-gallery">
          <div className="pd-thumbnails">
            {images.map((img, i) => (
              <div
                key={img.id}
                className={`pd-thumb ${selectedImage === i ? "active" : ""}`}
                onClick={() => setSelectedImage(i)}
              >
                <img src={img.url} alt={`${title} ${i + 1}`} />
              </div>
            ))}
          </div>

          <div className="pd-main-image">
            {images[selectedImage] && <img src={images[selectedImage].url} alt={title} />}
          </div>
        </div>

        <div className="pd-info">
          <span className="pd-category">{pick(product.categoryTitleAz, product.categoryTitleEn)}</span>
          <h1 className="pd-title">{title}</h1>

          <div className="pd-price-row">
            {hasDiscount ? (
              <>
                <span className="pd-price-discount">${product.discountPrice}</span>
                <span className="pd-price-original">${product.price}</span>
                <span className="pd-badge">-{discountPercent}%</span>
              </>
            ) : (
              <span className="pd-price">${product.price}</span>
            )}
          </div>

          <div className="pd-total-row">
            <span className="pd-total-label">{t("pd.total")}</span>
            <span className="pd-total-value">${(unitPrice * quantity).toFixed(2)}</span>
          </div>

          <div className="pd-divider" />

          {product.sizes.length > 0 && (
            <div className="pd-option-group">
              <div className="pd-option-label">
                {t("pd.size")}
                {selectedSize && <span className="pd-selected-val">: {selectedSize}</span>}
              </div>
              <div className="pd-size-buttons">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`pd-size-btn ${selectedSize === s ? "active" : ""}`}
                    onClick={() => { setSelectedSize(s); setSizeError(false); }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors.length > 0 && (
            <div className="pd-option-group">
              <div className="pd-option-label">
                {t("pd.color")}
                {selectedColor && <span className="pd-selected-val">: {selectedColor}</span>}
              </div>
              <div className="pd-color-swatches">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`pd-color-swatch ${selectedColor === c ? "active" : ""}`}
                    style={{ background: c.toLowerCase() }}
                    title={c}
                    onClick={() => setSelectedColor(c)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="pd-option-group">
            <div className="pd-option-label">{t("pd.quantity")}</div>
            <div className="pd-quantity">
              <button type="button" className="pd-qty-btn" aria-label="Decrease" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                <FiMinus />
              </button>
              <span className="pd-qty-val">{quantity}</span>
              <button type="button" className="pd-qty-btn" aria-label="Increase" onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}>
                <FiPlus />
              </button>
            </div>
            <span className="pd-stock">
              {product.stock > 0 ? t("pd.inStock", { n: product.stock }) : t("pd.outOfStock")}
            </span>
          </div>

          <div className="pd-divider" />

          <div className="pd-actions">
            <button type="button" className="pd-add-to-cart" disabled={product.stock === 0} onClick={handleAddToCart}>
              {t("pd.addToCart")}
            </button>

            <WishlistButton
              item={{
                id: product.id,
                slug: product.slug,
                titleEn: product.titleEn,
                price: product.price,
                discountPrice: product.discountPrice,
                image: images[0]?.url ?? "",
                stock: product.stock,
              }}
            />
          </div>

          {sizeError && <p className="pd-error">{t("pd.selectSize")}</p>}

          <div className="pd-divider" />

          {product.collectionTitleEn && (
            <p className="pd-collection">
              {t("pd.collection")}:{" "}
              <span>{pick(product.collectionTitleAz, product.collectionTitleEn)}</span>
            </p>
          )}

          {product.reviewCount > 0 && (
            <div className="pd-rating">
              {Array.from({ length: 5 }).map((_, i) =>
                i < Math.round(product.averageRating) ? <FaStar key={i} /> : <FaRegStar key={i} />
              )}
              <span>{t("pd.reviews", { n: product.reviewCount })}</span>
            </div>
          )}
        </div>
      </div>

      <ProductReviews productId={product.id} />

      <RecommendedProducts
        excludeIds={[product.id]}
        categories={[product.categoryTitleEn]}
      />
    </div>
  );
};

export default ProductDetail;