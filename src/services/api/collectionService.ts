import axiosInstance from "../../lib/axiosInstance";
import type { Collection } from "../../types/collection.types";

const BASE_URL = (import.meta.env.VITE_API_URL as string).replace("/api", "");

const fixImageUrl = (url: string): string => {
  if (/^https?:\/\//i.test(url)) return url;
  const cleaned = url.replace(/\/images\/(\w+)\/\/images\/\w+\//, "/images/$1/");
  return `${BASE_URL}${cleaned}`;
};

const normalizeCollection = (c: Collection): Collection => ({
  ...c,
  image: c.image ? fixImageUrl(c.image) : null,
});

export const getCollections = async (): Promise<Collection[]> => {
  const res = await axiosInstance.get<Collection[]>("/collections");
  return res.data.map(normalizeCollection);
};