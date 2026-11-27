import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFaq,
  createFaqCategory,
  deleteFaq,
  deleteFaqCategory,
  getAdminFaqs,
  getProductsOverview,
  updateFaq,
  updateFaqCategory,
} from "../services/api/adminService";
import type { FaqCategoryPayload, FaqPayload } from "../types/faq.types";

export const useProductsOverview = () =>
  useQuery({
    queryKey: ["admin", "products", "overview"],
    queryFn: getProductsOverview,
  });

export const useAdminFaqs = () =>
  useQuery({
    queryKey: ["faqs", "admin"],
    queryFn: getAdminFaqs,
  });

const useFaqMutation = <TVars>(mutationFn: (vars: TVars) => Promise<unknown>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["faqs"] }),
  });
};

export const useSaveFaq = () =>
  useFaqMutation(({ id, data }: { id?: number; data: FaqPayload }) =>
    id ? updateFaq(id, data) : createFaq(data)
  );

export const useDeleteFaq = () => useFaqMutation((id: number) => deleteFaq(id));

export const useSaveFaqCategory = () =>
  useFaqMutation(({ id, data }: { id?: number; data: FaqCategoryPayload }) =>
    id ? updateFaqCategory(id, data) : createFaqCategory(data)
  );

export const useDeleteFaqCategory = () =>
  useFaqMutation((id: number) => deleteFaqCategory(id));