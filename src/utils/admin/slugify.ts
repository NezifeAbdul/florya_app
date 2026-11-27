const charMap: Record<string, string> = {
  ə: "e", ı: "i", ö: "o", ü: "u", ç: "c", ş: "s", ğ: "g",
};

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[əıöüçşğ]/g, (char) => charMap[char] ?? char)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");