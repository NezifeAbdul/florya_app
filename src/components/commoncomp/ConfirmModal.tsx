import { useEffect } from "react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { FiAlertTriangle } from "react-icons/fi";

interface Props {
  open: boolean;
  title: string;
  message?: ReactNode;
  icon?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  tone?: "primary" | "danger";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({
  open,
  title,
  message,
  icon,
  confirmText,
  cancelText,
  tone = "primary",
  loading = false,
  onConfirm,
  onCancel,
}: Props) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="cl-backdrop" onMouseDown={onCancel}>
      <div
        className={`cl cl--${tone}`}
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <span className="cl__icon">{icon ?? <FiAlertTriangle />}</span>
        <h3 className="cl__title">{title}</h3>
        {message && <p className="cl__text">{message}</p>}

        <div className="cl__actions">
          <button type="button" className="cl__btn" onClick={onCancel} disabled={loading}>
            {cancelText ?? t("common.cancel")}
          </button>
          <button
            type="button"
            className="cl__btn cl__btn--primary"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? t("common.loading") : confirmText ?? t("common.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;