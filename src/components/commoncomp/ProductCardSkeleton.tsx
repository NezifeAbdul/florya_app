const ProductCardSkeleton = () => (
  <div className="product-card-wrapper prc-skeleton" aria-hidden="true">
    <div className="prc-img-wrapper">
      <div className="skeleton prc-skeleton__img" />
    </div>

    <div className="prc-info-wrapper">
      <div className="skeleton prc-skeleton__line prc-skeleton__brand" />
      <div className="skeleton prc-skeleton__line prc-skeleton__title" />
      <div className="skeleton prc-skeleton__line prc-skeleton__price" />
      <div className="skeleton prc-skeleton__size" />
    </div>
  </div>
);

interface ProductCardSkeletonListProps {
  count?: number;
  className?: string;
}

export const ProductCardSkeletonList = ({
  count = 6,
  className = "product-grid cols-3",
}: ProductCardSkeletonListProps) => (
  <div className={className}>
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export default ProductCardSkeleton;