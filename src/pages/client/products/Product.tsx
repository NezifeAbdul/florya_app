import { useState,useMemo,useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import Slider from "@mui/material/Slider";
import { FiColumns,FiFilter,FiX } from "react-icons/fi";
import { BsGrid3X3,BsGrid } from "react-icons/bs";
import { IoChevronDown } from "react-icons/io5";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import ProductCard from "../../../components/commoncomp/ProductCard";
import { ProductCardSkeletonList } from "../../../components/commoncomp/ProductCardSkeleton";
import SectionTitle from "../../../components/ui/SectionTitle";
import { useShopProductsWithDetails } from "../../../utils/useProducts";
import { useCollections } from "../../../utils/useCollection";
import { useLocalized } from "../../../utils/useLocalized";
import { useMinDelay } from "../../../utils/useMinDelay";
import type { ProductDetail } from "../../../types/product.types";
import service1 from "../../../assets/images/products/shipping.png";
import service2 from "../../../assets/images/products/return.png";
import service3 from "../../../assets/images/products/quantity.png";
import leaf from "../../../assets/images/leaf.webp";


const ITEMS_PER_PAGE = 6;

const services = [
  { id: 1, img: service1, key: "shipping" },
  { id: 2, img: service2, key: "returns" },
  { id: 3, img: service3, key: "quality" },
] as const;

type SortOption = "best" | "low" | "high" | "newest";

const Product = () => {
  const { t } = useTranslation();
  const pick = useLocalized();

  const [page, setPage]                               = useState(1);
  const [cols, setCols]                               = useState(3);
  const [sortBy, setSortBy]                           = useState<SortOption>("best");
  const [priceRange, setPriceRange]                   = useState<[number, number]>([0, 10000]);
  const [selectedSizes, setSelectedSizes]             = useState<string[]>([]);
  const [selectedColors, setSelectedColors]           = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories]   = useState<string[]>([]);
  const [inStock, setInStock]                         = useState(false);
  const [outOfStock, setOutOfStock]                   = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen]       = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const collectionId = searchParams.get("collectionId")
    ? Number(searchParams.get("collectionId"))
    : undefined;
  const category = searchParams.get("category");
  const search = (searchParams.get("search") ?? "").trim();

  const { data: products = [], isLoading, error } = useShopProductsWithDetails();
  const { data: collections = [] } = useCollections();
  const showSkeleton = useMinDelay(isLoading);

  useEffect(() => {
    setSelectedCollections(collectionId ? [collectionId] : []);
    setPage(1);
  }, [collectionId]);

  useEffect(() => { setPage(1); }, [search]);

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.categoryTitleEn));
    return Array.from(set).filter(Boolean);
  }, [products]);

  const categoriesKey = allCategories.join("|");

  const categoryLabel = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => map.set(p.categoryTitleEn, pick(p.categoryTitleAz, p.categoryTitleEn)));
    return (en: string) => map.get(en) ?? en;
  }, [products, pick]);

  useEffect(() => {
    if (category && allCategories.length > 0) {
      const match = allCategories.find((c) => c.toLowerCase() === category.toLowerCase());
      setSelectedCategories(match ? [match] : []);
    } else if (!category) {
      setSelectedCategories([]);
    }
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, categoriesKey]);

  const [openSections, setOpenSections] = useState({
    avail: true, price: true, color: true, size: true, collection: true, category: true,
  });

  const toggleSection = (key: keyof typeof openSections) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const maxPrice = useMemo(
    () => (products.length ? Math.max(...products.map((p) => p.price)) : 10000),
    [products]
  );

  const categoryScopedProducts = useMemo(() => {
    if (selectedCategories.length === 0) return products;
    return products.filter((p) => selectedCategories.includes(p.categoryTitleEn));
  }, [products, selectedCategories]);

  const allSizes = useMemo(() => {
    const set = new Set<string>();
    categoryScopedProducts.forEach((p) => p.sizes.forEach((s) => set.add(s)));
    return Array.from(set).filter(Boolean);
  }, [categoryScopedProducts]);

  const allColors = useMemo(() => {
    const set = new Set<string>();
    categoryScopedProducts.forEach((p) => p.colors.forEach((c) => set.add(c)));
    return Array.from(set).filter(Boolean);
  }, [categoryScopedProducts]);

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase();

    let list = products.filter((p: ProductDetail) => {
      if (q && !`${p.titleEn} ${p.titleAz}`.toLowerCase().includes(q)) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (selectedSizes.length  > 0 && !selectedSizes.some((s)  => p.sizes.includes(s)))  return false;
      if (selectedColors.length > 0 && !selectedColors.some((c) => p.colors.includes(c))) return false;
      if (
        selectedCollections.length > 0 &&
        (p.collectionId == null || !selectedCollections.includes(p.collectionId))
      ) return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.categoryTitleEn)) return false;

      const both = inStock && outOfStock;
      const none = !inStock && !outOfStock;
      if (!both && !none) {
        if (inStock    && p.stock <= 0) return false;
        if (outOfStock && p.stock > 0)  return false;
      }
      return true;
    });

    if (sortBy === "low")    list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "high")   list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "newest") list = [...list].sort((a, b) => b.id - a.id);

    return list;
  }, [products, search, priceRange, selectedSizes, selectedColors, selectedCollections, selectedCategories, inStock, outOfStock, sortBy]);

  const totalPages      = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const safePage        = Math.min(page, Math.max(1, totalPages));
  const currentProducts = filteredProducts.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const toggleSize       = (s: string)  => { setSelectedSizes((p)  => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]);  setPage(1); };
  const toggleColor      = (c: string)  => { setSelectedColors((p) => p.includes(c) ? p.filter((x) => x !== c) : [...p, c]); setPage(1); };
  const toggleCollection = (id: number) => { setSelectedCollections((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]); setPage(1); };
  const toggleCategory   = (cat: string) => { setSelectedCategories((p) => p.includes(cat) ? p.filter((x) => x !== cat) : [...p, cat]); setPage(1); };

  const clearSearch = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("search");
    setSearchParams(next);
  };

  const clearAll = () => {
    setInStock(false); setOutOfStock(false);
    setPriceRange([0, maxPrice]);
    setSelectedSizes([]); setSelectedColors([]);
    setSelectedCollections([]);
    setSelectedCategories([]);
    if (search) clearSearch();
    setPage(1);
  };

  const activeTags: { label: string; onRemove: () => void }[] = [];
  if (search)     activeTags.push({ label: t("search.tag", { q: search }), onRemove: clearSearch });
  if (inStock)    activeTags.push({ label: t("product.inStock"),    onRemove: () => { setInStock(false);    setPage(1); } });
  if (outOfStock) activeTags.push({ label: t("product.outOfStock"), onRemove: () => { setOutOfStock(false); setPage(1); } });
  if (priceRange[0] > 0 || priceRange[1] < maxPrice)
    activeTags.push({ label: `$${priceRange[0]} – $${priceRange[1]}`, onRemove: () => { setPriceRange([0, maxPrice]); setPage(1); } });
  selectedColors.forEach((c) => activeTags.push({ label: c, onRemove: () => toggleColor(c) }));
  selectedSizes.forEach((s)  => activeTags.push({ label: t("product.sizeTag", { size: s }), onRemove: () => toggleSize(s) }));
  selectedCollections.forEach((id) => {
    const col = collections.find((c) => c.id === id);
    if (col) activeTags.push({ label: pick(col.titleAz, col.titleEn), onRemove: () => toggleCollection(id) });
  });
  selectedCategories.forEach((cat) => activeTags.push({ label: categoryLabel(cat), onRemove: () => toggleCategory(cat) }));

  const toCardProduct = (p: ProductDetail) => ({
    ...p,
    primaryImage: p.images.find((i) => i.isPrimary)?.url ?? p.images[0]?.url ?? "",
    hoverImage:   p.images.find((i) => i.isHover)?.url  ?? null,
  });

  if (error) return <div className="container" style={{ padding: "4rem 0", textAlign: "center" }}>{t("common.error")}</div>;

  return (
    <div className="container product-container">
      <SectionTitle
        title={t("product.heroTitle")}
        subtitle={t("product.heroSubtitle")}
        img={leaf}
      />

      <div className="product-page">
        <aside className={`filter-panel ${mobileFilterOpen ? "" : "mobile-hidden"}`}>
          <div className="filter-panel__header">
            <h3>{t("product.filter")}</h3>
            <button className="clear-all" onClick={clearAll}>{t("product.clearAll")}</button>
          </div>

          {activeTags.length > 0 && (
            <div className="filter-panel__active-tags">
              {activeTags.map((tag, i) => (
                <span key={i} className="filter-tag">
                  {tag.label}
               <button className="tag-remove" onClick={tag.onRemove} aria-label="Remove"><FiX /></button>
                </span>
              ))}
            </div>
          )}

          {allCategories.length > 0 && (
            <div className="filter-panel__section">
              <div className="filter-panel__section-header" onClick={() => toggleSection("category")}>
                <span>{t("product.category")}</span>
                <IoChevronDown className={`chevron ${openSections.category ? "open" : ""}`} />
              </div>
              {openSections.category && allCategories.map((cat) => (
                <label className="filter-checkbox" key={cat}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                  />
                  <span>{categoryLabel(cat)} ({products.filter((p) => p.categoryTitleEn === cat).length})</span>
                </label>
              ))}
            </div>
          )}

          {collections.length > 0 && (
            <div className="filter-panel__section">
              <div className="filter-panel__section-header" onClick={() => toggleSection("collection")}>
                <span>{t("product.collection")}</span>
                <IoChevronDown className={`chevron ${openSections.collection ? "open" : ""}`} />
              </div>
              {openSections.collection && collections.map((c) => (
                <label className="filter-checkbox" key={c.id}>
                  <input
                    type="checkbox"
                    checked={selectedCollections.includes(c.id)}
                    onChange={() => toggleCollection(c.id)}
                  />
                  <span>{pick(c.titleAz, c.titleEn)} ({c.productCount})</span>
                </label>
              ))}
            </div>
          )}

          <div className="filter-panel__section">
            <div className="filter-panel__section-header" onClick={() => toggleSection("avail")}>
              <span>{t("product.availability")}</span>
              <IoChevronDown className={`chevron ${openSections.avail ? "open" : ""}`} />
            </div>
            {openSections.avail && (
              <>
                <label className="filter-checkbox">
                  <input type="checkbox" checked={inStock} onChange={(e) => { setInStock(e.target.checked); setPage(1); }} />
                  <span>{t("product.inStock")} ({products.filter((p) => p.stock > 0).length})</span>
                </label>
                <label className="filter-checkbox">
                  <input type="checkbox" checked={outOfStock} onChange={(e) => { setOutOfStock(e.target.checked); setPage(1); }} />
                  <span>{t("product.outOfStock")} ({products.filter((p) => p.stock <= 0).length})</span>
                </label>
              </>
            )}
          </div>

          <div className="filter-panel__section">
            <div className="filter-panel__section-header" onClick={() => toggleSection("price")}>
              <span>{t("product.price")}</span>
              <IoChevronDown className={`chevron ${openSections.price ? "open" : ""}`} />
            </div>
            {openSections.price && (
              <div className="price-slider-wrapper">
                <Slider
                  value={priceRange}
                  onChange={(_, val) => { setPriceRange(val as [number, number]); setPage(1); }}
                  min={0} max={maxPrice}
                  sx={{
                    color: "currentColor",
                    "& .MuiSlider-thumb": { width: 14, height: 14 },
                    "& .MuiSlider-rail":  { opacity: 0.2 },
                  }}
                />
                <div className="price-inputs">
                  <div className="price-input-group">
                    <span className="price-symbol">$</span>
                    <input type="number" value={priceRange[0]} min={0} max={priceRange[1]}
                      onChange={(e) => { setPriceRange([Math.max(0, +e.target.value), priceRange[1]]); setPage(1); }} />
                  </div>
                  <span className="price-dash">–</span>
                  <div className="price-input-group">
                    <span className="price-symbol">$</span>
                    <input type="number" value={priceRange[1]} min={priceRange[0]} max={maxPrice}
                      onChange={(e) => { setPriceRange([priceRange[0], Math.min(maxPrice, +e.target.value)]); setPage(1); }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {allColors.length > 0 && (
            <div className="filter-panel__section">
              <div className="filter-panel__section-header" onClick={() => toggleSection("color")}>
                <span>{t("product.color")}</span>
                <IoChevronDown className={`chevron ${openSections.color ? "open" : ""}`} />
              </div>
              {openSections.color && (
                <div className="color-swatches">
                  {allColors.map((c) => (
                    <div
                      key={c}
                      className={`swatch ${selectedColors.includes(c) ? "active" : ""}`}
                      title={c}
                      onClick={() => toggleColor(c)}
                      style={{ background: c.toLowerCase() }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {allSizes.length > 0 && (
            <div className="filter-panel__section">
              <div className="filter-panel__section-header" onClick={() => toggleSection("size")}>
                <span>{t("product.size")}</span>
                <IoChevronDown className={`chevron ${openSections.size ? "open" : ""}`} />
              </div>
              {openSections.size && (
                <div className="size-buttons">
                  {allSizes.map((s) => (
                    <button
                      key={s}
                      className={`size-btn ${selectedSizes.includes(s) ? "active" : ""}`}
                      onClick={() => toggleSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </aside>

        <div className="product-content">
          <div className="product-toolbar">
            <div className="product-toolbar__left">
              <button className="filter-toggle-btn" onClick={() => setMobileFilterOpen((v) => !v)}>
                <FiFilter size={13} />
                {mobileFilterOpen ? t("product.hideFilters") : t("product.filters")}
                {activeTags.length > 0 && ` (${activeTags.length})`}
              </button>
              <div className="product-toolbar__grid-switcher">
                <button className={cols === 2 ? "active" : ""} onClick={() => setCols(2)} title={t("product.columns", { n: 2 })}><FiColumns size={13} /></button>
                <button className={cols === 3 ? "active" : ""} onClick={() => setCols(3)} title={t("product.columns", { n: 3 })}><BsGrid3X3 size={13} /></button>
                <button className={`hide-mobile ${cols === 4 ? "active" : ""}`} onClick={() => setCols(4)} title={t("product.columns", { n: 4 })}><BsGrid size={13} /></button>
              </div>
            </div>
            <div className="product-toolbar__right">
              <div className="product-toolbar__sort">
                <span>{t("product.sortBy")}</span>
                <select value={sortBy} onChange={(e) => { setSortBy(e.target.value as SortOption); setPage(1); }}>
                  <option value="best">{t("product.sort.best")}</option>
                  <option value="low">{t("product.sort.low")}</option>
                  <option value="high">{t("product.sort.high")}</option>
                  <option value="newest">{t("product.sort.newest")}</option>
                </select>
              </div>
              <span className="product-toolbar__count">
                {showSkeleton ? "…" : t("product.count", { n: filteredProducts.length })}
              </span>
            </div>
          </div>

          {showSkeleton ? (
            <ProductCardSkeletonList count={ITEMS_PER_PAGE} className={`product-grid cols-${cols}`} />
          ) : filteredProducts.length === 0 ? (
            <div className="product-empty">
              <p>{t("product.empty")}</p>
              <button onClick={clearAll}>{t("product.clearFilters")}</button>
            </div>
          ) : (
            <div className={`product-grid cols-${cols}`}>
              {currentProducts.map((p) => (
                <ProductCard key={p.id} product={toCardProduct(p)} activeFilters={selectedSizes} />
              ))}
            </div>
          )}

          {!showSkeleton && totalPages > 1 && (
            <div className="product-pagination">
              <Pagination
                count={totalPages}
                page={safePage}
                onChange={(_, val) => { setPage(val); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                variant="outlined"
                shape="rounded"
                sx={{
                  "& .MuiPaginationItem-root": { fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "var(--text)", borderColor: "var(--border-strong)", borderRadius: "2px" },
                  "& .MuiPaginationItem-root.Mui-selected": { background: "var(--text)", color: "var(--bg)", borderColor: "var(--text)", "&:hover": { background: "var(--text-muted)" } },
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="product-services">
        {services.map((item) => (
          <div className="service-item" key={item.id}>
            <div className="service-inner">
              <img src={item.img} alt="" />
              <h3>{t(`product.services.${item.key}.title`)}</h3>
              <p>{t(`product.services.${item.key}.desc`)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;