import { useEffect, useMemo, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FiTrash2, FiEdit3, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useCreateReview, useDeleteReview, useProductReviews } from "../../utils/useReviews";
import { useRequireAuth } from "../../utils/useRequireAuth";
import { isAdmin } from "../../utils/auth";

const Stars = ({ value, onChange, size = 16 }: { value: number; onChange?: (n: number) => void; size?: number }) => (
  <span className="rv-stars">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        disabled={!onChange}
        className={`rv-star ${n <= value ? "on" : ""}`}
        onClick={() => onChange?.(n)}
        aria-label={`${n}`}
      >
        <FaStar size={size} />
      </button>
    ))}
  </span>
);

const ProductReviews = ({ productId }: { productId: number }) => {
  const { t, i18n } = useTranslation();
  const requireAuth = useRequireAuth();
  const { data: reviews = [], isLoading } = useProductReviews(productId);
  const create = useCreateReview();
  const remove = useDeleteReview();

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const { average, counts } = useMemo(() => {
    const c = [0, 0, 0, 0, 0];
    reviews.forEach((r) => (c[Math.min(5, Math.max(1, r.rating)) - 1] += 1));
    const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
    return { average: avg, counts: c };
  }, [reviews]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const openForm = () => {
    if (!requireAuth("auth.reviewRequired")) return;
    setOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return void toast.warning(t("reviews.pickRating"));
    if (comment.trim().length < 5) return void toast.warning(t("reviews.tooShort"));

    create.mutate(
      { productId, rating, comment: comment.trim() },
      {
        onSuccess: () => {
          setRating(0);
          setComment("");
          setOpen(false);
        },
      }
    );
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(i18n.language.startsWith("az") ? "az-AZ" : "en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });

  return (
    <section className="rv" id="reviews">
      <header className="rv__head">
        <h2>{t("reviews.title")}</h2>
        <button type="button" className="rv__write" onClick={openForm}>
          <FiEdit3 /> {t("reviews.write")}
        </button>
      </header>

      <div className="rv__summary">
        <div className="rv__score">
          <strong>{average.toFixed(1)}</strong>
          <Stars value={Math.round(average)} size={16} />
          <span>{t("reviews.count", { n: reviews.length })}</span>
        </div>

        <ul className="rv__bars">
          {[5, 4, 3, 2, 1].map((n) => {
            const pct = reviews.length ? (counts[n - 1] / reviews.length) * 100 : 0;
            return (
              <li key={n}>
                <span>{n}<FaStar size={11} /></span>
                <div className="rv__bar"><i style={{ width: `${pct}%` }} /></div>
                <em>{counts[n - 1]}</em>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rv__list">
        {isLoading ? (
          <p className="rv__empty">{t("common.loading")}</p>
        ) : reviews.length === 0 ? (
          <p className="rv__empty">{t("reviews.empty")}</p>
        ) : (
          reviews.map((r) => (
            <article className="rv__item" key={r.id}>
              <span className="rv__avatar">{(r.userFullName || "?").trim().charAt(0).toUpperCase()}</span>
              <div className="rv__body">
                <div className="rv__top">
                  <strong>{r.userFullName}</strong>
                  <time>{formatDate(r.createdAt)}</time>
                </div>
                <Stars value={r.rating} size={13} />
                <p>{r.comment}</p>
              </div>

              {isAdmin() &&
                (confirmId === r.id ? (
                  <span className="rv__confirm">
                    <button type="button" onClick={() => { remove.mutate(r.id); setConfirmId(null); }}>{t("common.confirm")}</button>
                    <button type="button" onClick={() => setConfirmId(null)}>{t("common.cancel")}</button>
                  </span>
                ) : (
                  <button type="button" className="rv__del" aria-label="Delete" onClick={() => setConfirmId(r.id)}>
                    <FiTrash2 />
                  </button>
                ))}
            </article>
          ))
        )}
      </div>

      {open && (
        <div className="rv-modal-backdrop" onMouseDown={() => setOpen(false)}>
          <form className="rv-modal" onSubmit={submit} onMouseDown={(e) => e.stopPropagation()}>
            <button type="button" className="rv-modal__close" aria-label="Close" onClick={() => setOpen(false)}>
              <FiX />
            </button>
            <h3>{t("reviews.write")}</h3>
            <p>{t("reviews.rateLabel")}</p>
            <Stars value={rating} onChange={setRating} size={30} />
            <textarea
              rows={5}
              maxLength={600}
              value={comment}
              autoFocus
              placeholder={t("reviews.placeholder")}
              onChange={(e) => setComment(e.target.value)}
            />
            <small>{comment.length}/600</small>
            <div className="rv-modal__actions">
              <button type="button" onClick={() => setOpen(false)}>{t("common.cancel")}</button>
              <button type="submit" className="primary" disabled={create.isPending}>
                {create.isPending ? t("reviews.sending") : t("reviews.submit")}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default ProductReviews;