import { useMemo, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { IoChevronDown } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import SectionTitle from "../../../components/ui/SectionTitle";
import { useFaqs, useFaqCategories } from "../../../utils/useFaqs";
import { useLocalized } from "../../../utils/useLocalized";
import leaf from "../../../assets/images/leaf.webp";

const accordionSx = {
  background: "transparent",
  borderBottom: "1px solid rgba(26,26,26,0.12)",
  "&:before": { display: "none" },
};

const summarySx = {
  padding: "18px 4px",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "14px",
  letterSpacing: "0.03em",
  color: "inherit",
  "& .MuiAccordionSummary-content": { margin: 0 },
};

const detailsSx = {
  padding: "0 4px 22px",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "13px",
  lineHeight: 1.8,
  color: "inherit",
  opacity: 0.75,
  whiteSpace: "pre-line",
};

const Faq = () => {
  const { t } = useTranslation();
  const pick = useLocalized();

  const [activeCategory, setActiveCategory] = useState<number | "all">("all");
  const [search, setSearch]                 = useState("");
  const [expanded, setExpanded]             = useState<number | false>(false);

  const { data: faqs = [], isLoading, error } = useFaqs();
  const { data: categories = [] }             = useFaqCategories();

  const visibleCategories = useMemo(
    () => categories.filter((c) => faqs.some((f) => f.faqCategoryId === c.id)),
    [categories, faqs]
  );

  const filteredFaqs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return faqs.filter((f) => {
      if (activeCategory !== "all" && f.faqCategoryId !== activeCategory) return false;
      if (!q) return true;
      return [f.questionEn, f.questionAz, f.answerEn, f.answerAz]
        .some((text) => text?.toLowerCase().includes(q));
    });
  }, [faqs, activeCategory, search]);

  const selectCategory = (id: number | "all") => {
    setActiveCategory(id);
    setExpanded(false);
  };

  if (isLoading) return <div className="container" style={{ padding: "4rem 0", textAlign: "center" }}>{t("common.loading")}</div>;
  if (error)     return <div className="container" style={{ padding: "4rem 0", textAlign: "center" }}>{t("common.error")}</div>;

  return (
    <div className="container faq-container">
      <SectionTitle title={t("faq.title")} subtitle={t("faq.subtitle")} img={leaf} />

      <div className="faq-toolbar">
        <div className="faq-tabs">
          <button
            className={`faq-tab ${activeCategory === "all" ? "active" : ""}`}
            onClick={() => selectCategory("all")}
          >
            {t("faq.all")}
          </button>
          {visibleCategories.map((c) => (
            <button
              key={c.id}
              className={`faq-tab ${activeCategory === c.id ? "active" : ""}`}
              onClick={() => selectCategory(c.id)}
            >
              {pick(c.titleAz, c.titleEn)}
            </button>
          ))}
        </div>

        <div className="faq-search">
          <FiSearch size={14} />
          <input
            type="text"
            placeholder={t("faq.search")}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setExpanded(false); }}
          />
        </div>
      </div>

      {filteredFaqs.length === 0 ? (
        <p className="faq-empty">{t("faq.noResults")}</p>
      ) : (
        <div className="faq-list">
          {filteredFaqs.map((f) => (
            <Accordion
              key={f.id}
              expanded={expanded === f.id}
              onChange={(_, isOpen) => setExpanded(isOpen ? f.id : false)}
              disableGutters
              elevation={0}
              square
              sx={accordionSx}
            >
              <AccordionSummary expandIcon={<IoChevronDown size={16} />} sx={summarySx}>
                {pick(f.questionAz, f.questionEn)}
              </AccordionSummary>
              <AccordionDetails sx={detailsSx}>
                {pick(f.answerAz, f.answerEn)}
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      )}
    </div>
  );
};

export default Faq;