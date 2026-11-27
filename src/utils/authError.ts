import axios from "axios";
import type { TFunction } from "i18next";

// serverdən gələn cavabı istifadəçiyə aydın səbəblə göstərir
export const authErrorMessage = (error: unknown, t: TFunction, mode: "login" | "register"): string => {
  if (axios.isAxiosError(error)) {
    if (!error.response) return t("auth.errors.network");

    const { status, data } = error.response;
    const raw = (
      typeof data === "string" ? data : data?.message ?? (Array.isArray(data) ? data.join(" ") : "")
    ) as string;
    const text = raw.toLowerCase();

    if (status === 401 || (mode === "login" && status === 400)) return t("auth.errors.wrongCredentials");
    if (status === 403) return t("auth.errors.forbidden");
    if (status === 409 || text.includes("already") || text.includes("exist") || text.includes("mövcud")) {
      if (text.includes("email")) return t("auth.errors.emailTaken");
      return t("auth.errors.accountExists");
    }
    if (status === 429) return t("auth.errors.tooMany");
    if (status >= 500) return t("auth.errors.server");
    if (raw) return raw;
  }
  return t("auth.errors.unknown");
};