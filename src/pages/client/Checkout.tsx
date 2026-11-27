import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { useAppDispatch, useAppSelector } from "../../utils/useAppDispatch";
import { clearBasketThunk, fetchBasketThunk } from "../../store/basketSlice";
import { createOrder } from "../../services/api/orderService";
import { useRequireAuth } from "../../utils/useRequireAuth";
import { getErrorMessage } from "../../utils/admin/getErrorMessage";
import { useShopProducts } from "../../utils/useProducts";
import { useLocalized } from "../../utils/useLocalized";

type Focused = "number" | "expiry" | "cvc" | "name" | "";

const Checkout = () => {
  const { t } = useTranslation();
  const pick = useLocalized();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const requireAuth = useRequireAuth();
  const { basket } = useAppSelector((s) => s.basket);

  const { data: shopProducts = [] } = useShopProducts();

  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    firstName: "", lastName: "",
    email: "", phone: "",
    address: "", city: "",
    country: "", postalCode: "",
  });

  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });

  const [focused, setFocused] = useState<Focused>("");

  useEffect(() => {
    if (!basket) dispatch(fetchBasketThunk());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formatted = value;

    if (name === "number") {
      formatted = value.replace(/\D/g, "").slice(0, 16)
        .replace(/(.{4})/g, "$1 ").trim();
    }
    if (name === "expiry") {
      formatted = value.replace(/\D/g, "").slice(0, 4)
        .replace(/^(\d{2})(\d)/, "$1/$2");
    }
    if (name === "cvc") {
      formatted = value.replace(/\D/g, "").slice(0, 4);
    }

    setCard((prev) => ({ ...prev, [name]: formatted }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!basket || submitting) return;
    if (!requireAuth("auth.checkoutRequired")) return;

    const required = [form.firstName, form.lastName, form.email, form.address, form.city, form.country];
    if (required.some((v) => !v.trim())) {
      toast.error(t("checkout.fillRequired"));
      return;
    }
    if (card.number.replace(/\s/g, "").length < 16 || card.expiry.length < 5 || card.cvc.length < 3 || !card.name.trim()) {
      toast.error(t("checkout.cardRequired"));
      return;
    }

    setSubmitting(true);
    try {
      // Kart məlumatı serverə göndərilmir
      const order = await createOrder({
        ...form,
        items: basket.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
        })),
      });

      // Səbət təmizlənməzdən əvvəl sifariş edilən məhsulları və kateqoriyaları yadda saxla
      const orderedIds = basket.items.map((item) => item.productId);
      const orderedCategories = Array.from(
        new Set(
          shopProducts
            .filter((p) => orderedIds.includes(p.id))
            .map((p) => p.categoryTitleEn)
        )
      );

      navigate("/order-success", {
        state: {
          orderId: order.id,
          total: order.totalPrice,
          orderedIds,
          orderedCategories,
        },
      });
      dispatch(clearBasketThunk());
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (!basket?.items.length) {
    return (
      <div style={{ textAlign: "center", padding: "6rem 0" }}>
        <p>{t("checkout.emptyBasket")}</p>
        <button
          onClick={() => navigate("/product")}
          style={{ marginTop: 16, padding: "10px 24px", cursor: "pointer" }}
        >
          {t("checkout.continueShopping")}
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-wrapper">
      <div className="checkout-container">


        <div className="checkout-left">
          <h1 className="checkout-brand">Florya</h1>

          <form onSubmit={handleSubmit} noValidate>

            <section className="checkout-section">
              <h2 className="checkout-section__title">{t("checkout.contact")}</h2>
              <div className="checkout-field">
                <input
                  name="email"
                  type="email"
                  placeholder={t("checkout.email")}
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="checkout-field">
                <input
                  name="phone"
                  type="tel"
                  placeholder={t("checkout.phone")}
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
            </section>

            <section className="checkout-section">
              <h2 className="checkout-section__title">{t("checkout.delivery")}</h2>
              <div className="checkout-row">
                <div className="checkout-field">
                  <input
                    name="firstName"
                    placeholder={t("checkout.firstName")}
                    value={form.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="checkout-field">
                  <input
                    name="lastName"
                    placeholder={t("checkout.lastName")}
                    value={form.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="checkout-field">
                <input
                  name="address"
                  placeholder={t("checkout.address")}
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="checkout-row">
                <div className="checkout-field">
                  <input
                    name="city"
                    placeholder={t("checkout.city")}
                    value={form.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="checkout-field">
                  <input
                    name="postalCode"
                    placeholder={t("checkout.postalCode")}
                    value={form.postalCode}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="checkout-field">
                <input
                  name="country"
                  placeholder={t("checkout.country")}
                  value={form.country}
                  onChange={handleChange}
                  required
                />
              </div>
            </section>

            <section className="checkout-section">
              <h2 className="checkout-section__title">{t("checkout.payment")}</h2>

              <div className="checkout-card-preview">
                <Cards
                  number={card.number}
                  name={card.name}
                  expiry={card.expiry}
                  cvc={card.cvc}
                  focused={focused}
                />
              </div>

              <div className="checkout-card-form">
                <div className="checkout-field">
                  <input
                    name="number"
                    placeholder={t("checkout.cardNumber")}
                    value={card.number}
                    onChange={handleCardChange}
                    onFocus={() => setFocused("number")}
                    onBlur={() => setFocused("")}
                    maxLength={19}
                    required
                  />
                </div>
                <div className="checkout-field">
                  <input
                    name="name"
                    placeholder={t("checkout.nameOnCard")}
                    value={card.name}
                    onChange={handleCardChange}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused("")}
                    required
                  />
                </div>
                <div className="checkout-row">
                  <div className="checkout-field">
                    <input
                      name="expiry"
                      placeholder={t("checkout.expiry")}
                      value={card.expiry}
                      onChange={handleCardChange}
                      onFocus={() => setFocused("expiry")}
                      onBlur={() => setFocused("")}
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="checkout-field">
                    <input
                      name="cvc"
                      placeholder={t("checkout.cvc")}
                      value={card.cvc}
                      onChange={handleCardChange}
                      onFocus={() => setFocused("cvc")}
                      onBlur={() => setFocused("")}
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </div>
            </section>

            <button type="submit" className="checkout-submit" disabled={submitting}>
              {submitting
                ? t("checkout.processing")
                : `${t("checkout.pay")} ($${basket.totalPrice.toLocaleString()})`}
            </button>
          </form>
        </div>

        <div className="checkout-right">
          <div className="checkout-summary">
            {basket.items.map((item) => {
              const title = pick(item.productTitleAz, item.productTitleEn);
              return (
                <div key={item.id} className="checkout-summary__item">
                  <div className="checkout-summary__img-wrap">
                    <img src={item.productImage} alt={title} />
                    <span className="checkout-summary__qty">{item.quantity}</span>
                  </div>
                  <div className="checkout-summary__item-info">
                    <p className="checkout-summary__item-title">{title}</p>
                    {item.selectedSize?.trim() && (
                      <span className="checkout-summary__item-meta">{item.selectedSize}</span>
                    )}
                  </div>
                  <span className="checkout-summary__item-price">
                    ${(item.unitPrice * item.quantity).toLocaleString()}
                  </span>
                </div>
              );
            })}

            <div className="checkout-summary__divider" />

            <div className="checkout-summary__row">
              <span>{t("checkout.subtotal")}</span>
              <span>${basket.totalPrice.toLocaleString()}</span>
            </div>
            <div className="checkout-summary__row">
              <span>{t("checkout.shipping")}</span>
              <span className="checkout-summary__shipping">{t("checkout.shippingNote")}</span>
            </div>

            <div className="checkout-summary__divider" />

            <div className="checkout-summary__row checkout-summary__total">
              <span>{t("checkout.total")}</span>
              <span>${basket.totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;