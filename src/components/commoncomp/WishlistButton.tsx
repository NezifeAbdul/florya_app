import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useWishlist } from "../../utils/wishlistStore";
import type { WishlistItem } from "../../utils/wishlistStore";
import { useRequireAuth } from "../../auth/useRequireAuth";

const WishlistButton = ({ item }: { item: WishlistItem }) => {
  const { t } = useTranslation();
  const { has, toggle } = useWishlist();
  const requireAuth = useRequireAuth();
  const wished = has(item.id);

  const onClick = () => {
    if (!requireAuth("auth.wishlistRequired")) return;
    const added = toggle(item);
    toast.success(added ? t("card.wishlistAdded") : t("card.wishlistRemoved"), {
      toastId: `wl-${item.id}-${added}`,
    });
  };

  return (
    <button
      type="button"
      className={`pd-wish ${wished ? "wished" : ""}`}
      aria-label="Wishlist"
      aria-pressed={wished}
      onClick={onClick}
    >
      {wished ? <FaHeart /> : <FiHeart />}
    </button>
  );
};

export default WishlistButton;