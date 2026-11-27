import { useMemo } from "react";
import { Link, Navigate, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { FiCheckCircle } from "react-icons/fi";
import RecommendedProducts from "../../components/commoncomp/RecommendedProducts";

interface SuccessState {
  orderId: number;
  total: number;
  orderedIds: number[];
  orderedCategories: string[];
}

const OrderSuccess = () => {
  const { t } = useTranslation();
  const state = useLocation().state as SuccessState | null;

  const excludeIds = useMemo(() => state?.orderedIds ?? [], [state]);
  const categories = useMemo(() => state?.orderedCategories ?? [], [state]);

  if (!state) return <Navigate to="/" replace />;

  return (
    <div className="container order-success">
      <div className="order-success__box">
        <FiCheckCircle className="order-success__icon" />
        <h1>{t("success.title")}</h1>
        <p>{t("success.text")}</p>
        <div className="order-success__meta">
          <span>{t("success.order")} #{state.orderId}</span>
          <strong>${state.total.toLocaleString()}</strong>
        </div>
        <div className="order-success__actions">
          <Link to="/product" className="wishlist-btn-link">{t("success.continue")}</Link>
          <Link to="/" className="order-success__home">{t("success.home")}</Link>
        </div>
      </div>

      <RecommendedProducts excludeIds={excludeIds} categories={categories} limit={4} />
    </div>
  );
};

export default OrderSuccess;