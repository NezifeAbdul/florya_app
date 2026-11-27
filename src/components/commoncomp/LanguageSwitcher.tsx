import { useTranslation } from "react-i18next";

const LANGS = ["en", "az"] as const;

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const current = i18n.language.startsWith("az") ? "az" : "en";

  const change = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
  };

  return (
    <div className="lang-switch" data-active={current} role="group" aria-label="Language">
      {LANGS.map((lng) => (
        <button
          key={lng}
          type="button"
          className={`lang-switch__btn ${current === lng ? "active" : ""}`}
          aria-pressed={current === lng}
          onClick={() => change(lng)}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;