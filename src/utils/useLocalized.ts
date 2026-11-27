import { useTranslation } from "react-i18next";

export const useLocalized = () => {
  const { i18n } = useTranslation();
  const isAz = i18n.language.startsWith("az");

  // pick(az, en): seçilmiş dilə uyğun mətni qaytarır, boşdursa o birini
  return (az?: string | null, en?: string | null) => (isAz ? az || en : en || az) ?? "";
};