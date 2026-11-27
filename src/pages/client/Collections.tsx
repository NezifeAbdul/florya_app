import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { IoSnowOutline, IoSunnyOutline } from "react-icons/io5";
import leaf from "../../assets/images/leaf.webp";
import { useCollections } from "../../hooks/useCollection";
import { useLocalized } from "../../hooks/useLocalized";
import SectionTitle from "../../components/ui/SectionTitle";
import { PageLoader } from "../../components/commoncomp/Loader";

const Collections = () => {
  const { t } = useTranslation();
  const pick = useLocalized();
  const navigate = useNavigate();
  const { data: collections = [], isLoading, error } = useCollections();

  const open = (id: number) => navigate(`/product?collectionId=${id}`);

  if (isLoading) return <PageLoader height="60vh" />;
  if (error) return <div className="collections-state">{t("common.error")}</div>;

  return (
    <div className="collections-wrapper">
      <div className="container">
        <SectionTitle
          title={t("collections.title")}
          subtitle={t("collections.subtitle")}
          img={leaf}
        />

        <div className="collections-grid">
          {collections.map((c) => {
            const winter = /winter|outumn|autumn|qış|payız/i.test(`${c.titleEn} ${c.titleAz}`);

            return (
              <div
                key={c.id}
                className="collection-card"
                role="link"
                tabIndex={0}
                onClick={() => open(c.id)}
                onKeyDown={(e) => e.key === "Enter" && open(c.id)}
              >
                <div
                  className={`collection-card__img ${c.image ? "has-image" : ""}`}
                  style={c.image ? ({ "--bg-image": `url(${c.image})` } as React.CSSProperties) : undefined}
                >
                  <div className="collection-card__overlay" />

                  <span className="collection-card__season">
                    {winter ? <IoSnowOutline /> : <IoSunnyOutline />}
                  </span>
                  <span className="collection-card__go">
                    <FiArrowUpRight />
                  </span>

                  <div className="collection-card__content">
                    <span className="collection-card__count">
                      {t("collections.products", { n: c.productCount })}
                    </span>
                    <h2 className="collection-card__title">{pick(c.titleAz, c.titleEn)}</h2>
                    <span className="collection-card__btn">
                      {t("collections.shop")} <FiArrowRight />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Collections;