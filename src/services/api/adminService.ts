import axiosInstance from "../../lib/axiosInstance";
import type { Faq, FaqCategory, FaqPayload, FaqCategoryPayload } from "../../types/faq.types";
import type { ProductListResponse } from "../../types/product.types";
import { normalizeProduct } from "./productService";

export const getProductsOverview = async () => {
  const res = await axiosInstance.get<ProductListResponse>("/products");
  return {
    total: res.data.totalCount,
    items: res.data.items.map(normalizeProduct),
  };
};

export const getAdminFaqs = async (): Promise<Faq[]> => {
  const res = await axiosInstance.get<Faq[]>("/Faqs/admin");
  return res.data;
};

export const createFaq = async (data: FaqPayload): Promise<Faq> => {
  const res = await axiosInstance.post<Faq>("/Faqs", data);
  return res.data;
};

export const updateFaq = async (id: number, data: FaqPayload): Promise<Faq> => {
  const res = await axiosInstance.put<Faq>(`/Faqs/${id}`, data);
  return res.data;
};

export const deleteFaq = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/Faqs/${id}`);
};

export const createFaqCategory = async (data: FaqCategoryPayload): Promise<FaqCategory> => {
  const res = await axiosInstance.post<FaqCategory>("/FaqCategories", data);
  return res.data;
};

export const updateFaqCategory = async (id: number, data: FaqCategoryPayload): Promise<FaqCategory> => {
  const res = await axiosInstance.put<FaqCategory>(`/FaqCategories/${id}`, data);
  return res.data;
};

export const deleteFaqCategory = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/FaqCategories/${id}`);
};