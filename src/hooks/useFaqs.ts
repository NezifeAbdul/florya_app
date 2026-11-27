import { useQuery } from "@tanstack/react-query";
import { getFaqs, getFaqCategories } from "../services/api/faqService";

export const useFaqs = () =>
  useQuery({
    queryKey: ["faqs"],
    queryFn: getFaqs,
  });

export const useFaqCategories = () =>
  useQuery({
    queryKey: ["faqs", "categories"],
    queryFn: getFaqCategories,
  });