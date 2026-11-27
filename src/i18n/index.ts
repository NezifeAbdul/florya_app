import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en";
import az from "./locales/az";

const saved = localStorage.getItem("lang");

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, az: { translation: az } },
  lng: saved === "az" ? "az" : "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("lang", lng);
  document.documentElement.lang = lng;
});

document.documentElement.lang = i18n.language;

export default i18n;
