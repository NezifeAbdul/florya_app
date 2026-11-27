const BASE_URL = (import.meta.env.VITE_API_URL as string).replace("/api", "");

export const imageUrl = (url?: string | null): string => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("blob:")) return url;
  const cleaned = url.replace(/\/images\/(\w+)\/\/images\/\w+\//, "/images/$1/");
  return `${BASE_URL}${cleaned.startsWith("/") ? "" : "/"}${cleaned}`;
};