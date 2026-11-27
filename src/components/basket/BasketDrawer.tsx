import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FiX, FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../utils/useAppDispatch";
import { useLocalized } from "../../utils/useLocalized";
import {
  closeBasket,
  fetchBasketThunk,
  removeBasketItemThunk,
  updateBasketItemThunk,
  clearBasketThunk,
} from "../../store/basketSlice";
import EmptyBasket from "./EmptyBasket";
import ConfirmModal from "../commoncomp/ConfirmModal";

const BasketDrawer = () => {
  const { t } = useTranslation();
  const pick = useLocalized();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { basket, isOpen, loading } = useAppSelector((s) => s.basket);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (isOpen && !basket) dispatch(fetchBasketThunk());
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) setConfirmClear(false);
  }, [isOpen]);

  const hasItems = !!basket?.items.length;

  const handleCheckout = () => {
    dispatch(closeBasket());
    navigate("/checkout");
  };

  const handleRemove = (id: number) => {
    dispatch(removeBasketItemThunk(id));
    toast.info(t("basket.removed"), { toastId: `rm-${id}` });
  };

  const handleClear = () => {
    dispatch(clearBasketThunk());
    setConfirmClear(false);
    toast.info(t("basket.cleared"));
  };

  return (
    <>
      <div
        className={`basket-overlay ${isOpen ? "active" : ""}`}
        onClick={() => dispatch(closeBasket())}
      />

      <div className={`basket-drawer ${isOpen ? "open" : ""}`}>
        <div className="basket-drawer__header">
          <h2 className="basket-drawer__title">
            {t("basket.title")} {basket?.totalItemCount ? `(${basket.totalItemCount})` : ""}
          </h2>
          <button className="basket-drawer__close" onClick={() => dispatch(closeBasket())} aria-label="Close">
            <FiX size={20} />
          </button>
        </div>

        {hasItems && <div className="basket-drawer__notice">{t("basket.notice")}</div>}

        <div className="basket-drawer__body">
          {!hasItems ? (
            <EmptyBasket />
          ) : (
            basket!.items.map((item) => {
              const title = pick(item.productTitleAz, item.productTitleEn);
              return (
                <div key={item.id} className="basket-item">
                  <img className="basket-item__img" src={item.productImage} alt={title} />
                  <div className="basket-item__info">
                    <p className="basket-item__title">{title}</p>
                    {item.selectedSize && (
                      <span className="basket-item__meta">{t("basket.size")}: {item.selectedSize}</span>
                    )}
                    {item.selectedColor && (
                      <span className="basket-item__meta">{t("basket.color")}: {item.selectedColor}</span>
                    )}

                    <div className="basket-item__row">
                      <div className="basket-item__qty">
                        <button
                          aria-label="Decrease"
                          disabled={loading || item.quantity <= 1}
                          onClick={() => dispatch(updateBasketItemThunk({ itemId: item.id, quantity: item.quantity - 1 }))}
                        >
                          <FiMinus />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          aria-label="Increase"
                          disabled={loading || item.quantity >= item.availableStock}
                          onClick={() => dispatch(updateBasketItemThunk({ itemId: item.id, quantity: item.quantity + 1 }))}
                        >
                          <FiPlus />
                        </button>
                      </div>
                      <span className="basket-item__price">
                        ${(item.unitPrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    className="basket-item__remove"
                    aria-label="Remove"
                    onClick={() => handleRemove(item.id)}
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {hasItems && (
          <div className="basket-drawer__footer">
            <div className="basket-drawer__total">
              <span>{t("basket.total")}</span>
              <span>${basket!.totalPrice.toLocaleString()}</span>
            </div>
            <button className="basket-drawer__checkout" onClick={handleCheckout}>
              {t("basket.checkout")} (${basket!.totalPrice.toLocaleString()})
            </button>
            <button className="basket-drawer__clear" onClick={() => setConfirmClear(true)}>
              {t("basket.clear")}
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        open={confirmClear}
        tone="danger"
        icon={<FiTrash2 />}
        title={t("basket.clear")}
        message={t("basket.clearConfirm")}
        onConfirm={handleClear}
        onCancel={() => {
          setConfirmClear(false);
          toast.info(t("basket.clearCancelled"));
        }}
      />
    </>
  );
};

export default BasketDrawer;