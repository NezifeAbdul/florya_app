import axiosInstance from "../../lib/axiosInstance";
import type { Faq, FaqCategory } from "../../types/faq.types";

export const getFaqs = async (): Promise<Faq[]> => {
  const res = await axiosInstance.get<Faq[]>("/Faqs");
  return res.data;
};

export const getFaqCategories = async (): Promise<FaqCategory[]> => {
  const res = await axiosInstance.get<FaqCategory[]>("/FaqCategories");
  return res.data;
};