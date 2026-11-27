import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import ProductCard from "./ProductCard";
import { ProductCardSkeletonList } from "./ProductCardSkeleton";
import SectionTitle from "../ui/SectionTitle";
import { useShopProducts } from "../../hooks/useProducts";
import { useMinDelay } from "../../hooks/useMinDelay";
import leaf from "../../assets/images/leaf.webp";

interface Props {
  excludeIds?: number[];
  categories?: string[];
  limit?: number;
}

const RecommendedProducts = ({ excludeIds = [], categories = [], limit = 4 }: Props) => {
  const { t } = useTranslation();
  const { data: products = [], isLoading } = useShopProducts();
  const showSkeleton = useMinDelay(isLoading);

  const recommended = useMemo(() => {
    if (categories.length === 0) return [];

    const same = products.filter(
      (p) => p.isActive && !excludeIds.includes(p.id) && categories.includes(p.categoryTitleEn)
    );

    // stokda olanlar əvvəl, sonra endirimli olanlar
    return same
      .sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0) || (b.discountPrice ? 1 : 0) - (a.discountPrice ? 1 : 0))
      .slice(0, limit);
  }, [products, excludeIds, categories, limit]);

  if (!showSkeleton && recommended.length === 0) return null;

  return (
    <section className="recommended">
      <SectionTitle title={t("recommended.title")} subtitle={t("recommended.subtitle")} img={leaf} />

      {showSkeleton ? (
        <ProductCardSkeletonList count={limit} className="recommended__grid" />
      ) : (
        <div className="recommended__grid">
          {recommended.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
};

export default RecommendedProducts;