import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { FiSearch, FiX } from "react-icons/fi";
import { useShopProducts } from "../../utils/useProducts";
import { useLocalized } from "../../utils/useLocalized";

const SearchBar = ({ mobile = false }: { mobile?: boolean }) => {
  const { t } = useTranslation();
  const pick = useLocalized();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: products = [] } = useShopProducts();

  const wrapRef = useRef<HTMLDivElement>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim().toLowerCase()), 250);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setFocused(false);
        setPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    setPanelOpen(false);
    setFocused(false);
  }, [pathname]);

  const results = useMemo(() => {
    if (!debounced) return [];
    return products
      .filter((p) => p.isActive && `${p.titleEn} ${p.titleAz}`.toLowerCase().includes(debounced))
      .slice(0, 5);
  }, [products, debounced]);

  const reset = () => {
    setQuery("");
    setDebounced("");
    setFocused(false);
    setPanelOpen(false);
  };

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/product?search=${encodeURIComponent(q)}`);
    reset();
  };

  const showDrop = focused && debounced.length > 0;

  const field = (
    <form className="sb__form" onSubmit={submit} role="search">
      <FiSearch className="sb__icon" />
      <input
        className="sb__input"
        value={query}
        autoComplete="off"
        placeholder={t("search.placeholder")}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
      />
      {query && (
        <button type="button" className="sb__clear" onClick={reset} aria-label="Clear">
          <FiX />
        </button>
      )}
    </form>
  );

  const drop = showDrop && (
    <div className="sb__drop">
      {results.length === 0 ? (
        <p className="sb__empty">{t("search.noResults")}</p>
      ) : (
        <>
          {results.map((p) => (
            <button
              type="button"
              key={p.id}
              className="sb__item"
              onClick={() => {
                navigate(`/products/${p.slug}`);
                reset();
              }}
            >
              <img src={p.primaryImage} alt="" />
              <span className="sb__item-title">{pick(p.titleAz, p.titleEn)}</span>
              <span className="sb__item-price">
                ${p.discountPrice != null && p.discountPrice < p.price ? p.discountPrice : p.price}
              </span>
            </button>
          ))}
          <button type="button" className="sb__all" onClick={() => submit()}>
            {t("search.viewAll")}
          </button>
        </>
      )}
    </div>
  );

  if (mobile) {
    return (
      <div className="sb sb--mobile" ref={wrapRef}>
        <button type="button" className="sb__toggle" aria-label="Search" onClick={() => setPanelOpen((v) => !v)}>
          <FiSearch />
        </button>
        {panelOpen && (
          <div className="sb__panel">
            {field}
            {drop}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="sb" ref={wrapRef}>
      {field}
      {drop}
    </div>
  );
};

export default SearchBar;